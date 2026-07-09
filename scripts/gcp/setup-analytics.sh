#!/usr/bin/env bash
# Provision GCP analytics pipeline: Cloud Logging → BigQuery → Looker Studio views.
#
# Usage:
#   ./scripts/gcp/setup-analytics.sh [PROJECT_ID]
#
# Prerequisites: gcloud CLI authenticated, BigQuery and Logging APIs enabled.

set -euo pipefail

PROJECT_ID="${1:-$(gcloud config get-value project 2>/dev/null)}"
DATASET_ID="portfolio_analytics"
SINK_NAME="portfolio-analytics-sink"
LOCATION="us-central1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_DIR="${SCRIPT_DIR}/sql"

resolve_python_for_bq() {
  if [[ -n "${CLOUDSDK_PYTHON:-}" ]] && "${CLOUDSDK_PYTHON}" -c "import sys" >/dev/null 2>&1; then
    return 0
  fi

  local candidates=()
  if command -v py >/dev/null 2>&1; then
    candidates+=("py -3")
  fi
  if command -v python3 >/dev/null 2>&1; then
    candidates+=("python3")
  fi
  if command -v python >/dev/null 2>&1; then
    candidates+=("python")
  fi

  for candidate in "${candidates[@]}"; do
    # shellcheck disable=SC2086
    if executable="$(${candidate} -c 'import sys; print(sys.executable)' 2>/dev/null)"; then
      export CLOUDSDK_PYTHON="${executable}"
      echo "==> Using Python for bq: ${CLOUDSDK_PYTHON}"
      return 0
    fi
  done

  echo "ERROR: bq requires Python. Install Python 3 or set CLOUDSDK_PYTHON." >&2
  echo "       Windows: py -3 should work after installing Python from python.org" >&2
  exit 1
}

bq_cmd() {
  resolve_python_for_bq
  bq "$@"
}

grant_sink_dataset_access() {
  local sink_email="${SINK_SA#serviceAccount:}"
  local dataset_ref="${PROJECT_ID}:${DATASET_ID}"

  echo "==> Granting sink writer access to BigQuery dataset..."

  if gcloud bigquery datasets add-iam-policy-binding "${DATASET_ID}" \
    --project="${PROJECT_ID}" \
    --member="${SINK_SA}" \
    --role="roles/bigquery.dataEditor" \
    --quiet >/dev/null 2>&1; then
    echo "    Granted via gcloud bigquery datasets add-iam-policy-binding"
    return 0
  fi

  if bq_cmd add-iam-policy-binding \
    --project_id="${PROJECT_ID}" \
    --member="${SINK_SA}" \
    --role="roles/bigquery.dataEditor" \
    "${dataset_ref}" >/dev/null 2>&1; then
    echo "    Granted via bq add-iam-policy-binding"
    return 0
  fi

  echo "    IAM binding unavailable — updating dataset ACL (WRITER)..."
  resolve_python_for_bq
  local tmp_json
  tmp_json="$(mktemp)"
  bq_cmd show --format=prettyjson "${dataset_ref}" > "${tmp_json}"

  local updated="false"
  if CLOUDSDK_PYTHON="${CLOUDSDK_PYTHON}" "${CLOUDSDK_PYTHON}" - "${tmp_json}" "${sink_email}" <<'PY'
import json
import sys

path, sink_email = sys.argv[1], sys.argv[2]
with open(path, encoding="utf-8") as fh:
    dataset = json.load(fh)

access = dataset.get("access", [])
if any(
    entry.get("userByEmail") == sink_email and entry.get("role") == "WRITER"
    for entry in access
):
    sys.exit(1)

access.append({"role": "WRITER", "userByEmail": sink_email})
dataset["access"] = access
with open(path, "w", encoding="utf-8") as fh:
    json.dump(dataset, fh)
PY
  then
    updated="true"
  fi

  if [[ "${updated}" == "true" ]]; then
    bq_cmd update --source "${tmp_json}" "${dataset_ref}"
    echo "    Granted via dataset ACL"
  else
    echo "    Sink writer already has dataset access"
  fi
  rm -f "${tmp_json}"
}

run_view_sql() {
  local sql_file="$1"
  local sql tmp_sql exit_code=0
  sql="$(sed "s/\${PROJECT_ID}/${PROJECT_ID}/g" "${sql_file}")"
  echo "==> Applying $(basename "${sql_file}")..."
  tmp_sql="$(mktemp)"
  printf '%s\n' "${sql}" > "${tmp_sql}"
  set +e
  bq_cmd query \
    --project_id="${PROJECT_ID}" \
    --use_legacy_sql=false \
    --quiet \
    < "${tmp_sql}"
  exit_code=$?
  set -e
  rm -f "${tmp_sql}"
  return "${exit_code}"
}

if [[ -z "${PROJECT_ID}" || "${PROJECT_ID}" == "(unset)" ]]; then
  echo "ERROR: Set a GCP project ID via argument or gcloud config." >&2
  exit 1
fi

echo "==> Project: ${PROJECT_ID}"
echo "==> Dataset: ${DATASET_ID}"

echo "==> Enabling required APIs..."
gcloud services enable logging.googleapis.com bigquery.googleapis.com \
  --project="${PROJECT_ID}"

echo "==> Creating BigQuery dataset (if missing)..."
if ! bq_cmd show --project_id="${PROJECT_ID}" "${DATASET_ID}" >/dev/null 2>&1; then
  bq_cmd --project_id="${PROJECT_ID}" mk \
    --dataset \
    --location="${LOCATION}" \
    --description="Portfolio web + agent analytics events" \
    "${DATASET_ID}"
fi

LOG_FILTER='resource.type="cloud_run_revision"
(resource.labels.service_name="portfolio-web" OR resource.labels.service_name="portfolio-agent")
(jsonPayload.message="portfolio_event" OR textPayload=~"portfolio_event")'

SINK_DEST="bigquery.googleapis.com/projects/${PROJECT_ID}/datasets/${DATASET_ID}"

echo "==> Creating or updating Log Router sink..."
if gcloud logging sinks describe "${SINK_NAME}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
  gcloud logging sinks update "${SINK_NAME}" \
    "${SINK_DEST}" \
    --project="${PROJECT_ID}" \
    --log-filter="${LOG_FILTER}"
else
  gcloud logging sinks create "${SINK_NAME}" \
    "${SINK_DEST}" \
    --project="${PROJECT_ID}" \
    --log-filter="${LOG_FILTER}" \
    --use-partitioned-tables
fi

SINK_SA="$(gcloud logging sinks describe "${SINK_NAME}" \
  --project="${PROJECT_ID}" \
  --format='value(writerIdentity)')"
echo "    Sink service account: ${SINK_SA}"

grant_sink_dataset_access

echo ""
echo "==> Creating BigQuery views..."
echo "    NOTE: v_events requires the sink table run_googleapis_com_stdout."
echo "    It appears after the first matching log is exported (may take a few minutes)."

for sql_file in \
  "${SQL_DIR}/v_events.sql" \
  "${SQL_DIR}/v_page_views.sql" \
  "${SQL_DIR}/v_chat_funnel.sql" \
  "${SQL_DIR}/v_chat_turns.sql" \
  "${SQL_DIR}/v_top_queries.sql" \
  "${SQL_DIR}/v_labs_interactions.sql"
do
  if [[ -f "${sql_file}" ]]; then
    if ! run_view_sql "${sql_file}"; then
      echo "    WARN: $(basename "${sql_file}") failed — re-run after logs arrive in BigQuery."
    fi
  fi
done

echo ""
echo "==> Optional: log-based metrics (Monitoring)"
METRIC_FILTER='resource.type="cloud_run_revision"
jsonPayload.event="chat_error"'

if ! gcloud logging metrics describe portfolio_chat_errors \
  --project="${PROJECT_ID}" >/dev/null 2>&1; then
  gcloud logging metrics create portfolio_chat_errors \
    --project="${PROJECT_ID}" \
    --description="Chat errors from portfolio agent and web proxy" \
    --log-filter="${METRIC_FILTER}" || true
fi

echo ""
echo "Done."
echo ""
echo "Next steps:"
echo "  1. Deploy portfolio-web and portfolio-agent with the new structured logging."
echo "  2. Generate traffic (browse pages, send chat messages)."
echo "  3. Wait ~5 min, then verify:"
echo "       bq query --use_legacy_sql=false 'SELECT event, COUNT(*) FROM \`${PROJECT_ID}.${DATASET_ID}.v_events\` GROUP BY 1'"
echo "  4. Open Looker Studio → BigQuery → connect views in ${DATASET_ID}."
echo "  5. See docs/analytics-gcp.md for dashboard layout."
