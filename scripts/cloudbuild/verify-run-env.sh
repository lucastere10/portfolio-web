#!/usr/bin/env bash
set -euo pipefail

SERVICE="${1:?Cloud Run service name required}"
REGION="${2:?Region required}"

yaml="$(gcloud run services describe "${SERVICE}" --region="${REGION}" --format=yaml)"

for var in CONTACT_FROM_EMAIL CONTACT_TO_EMAIL PORTFOLIO_AGENT_BASE_URL; do
  if ! grep -q "name: ${var}" <<<"${yaml}"; then
    echo "Missing env var ${var} on ${SERVICE}" >&2
    exit 1
  fi
done

if ! grep -q "name: RESEND_API_KEY" <<<"${yaml}"; then
  echo "Missing secret env RESEND_API_KEY on ${SERVICE}" >&2
  exit 1
fi

echo "Cloud Run env vars verified on ${SERVICE}"
