#!/usr/bin/env bash
set -euo pipefail

AGENT_URL="${1:?Agent base URL required}"
AGENT_SERVICE_NAME="${2:?Agent service name required}"
REGION="${3:?Region required}"

if [[ -z "${AGENT_URL}" ]]; then
  echo "Agent base URL is empty" >&2
  exit 1
fi

gcloud run services describe "${AGENT_SERVICE_NAME}" \
  --region="${REGION}" \
  --format='value(status.url)' >/dev/null

if ! gcloud secrets describe RESEND_API_KEY >/dev/null 2>&1; then
  echo "Secret RESEND_API_KEY not found in Secret Manager" >&2
  echo "Create it with: echo -n 're_...' | gcloud secrets create RESEND_API_KEY --data-file=-" >&2
  exit 1
fi

echo "Agent service ${AGENT_SERVICE_NAME} exists in ${REGION}"
echo "Agent URL configured as ${AGENT_URL}"
echo "Secret RESEND_API_KEY exists"
