#!/usr/bin/env bash
set -euo pipefail

AGENT_URL="${1:?Agent base URL required}"
WEB_SA="${2:?Portfolio web service account email required}"

TOKEN="$(gcloud auth print-identity-token \
  --impersonate-service-account="${WEB_SA}" \
  --audiences="${AGENT_URL}")"

RESPONSE="$(curl -sf -H "Authorization: Bearer ${TOKEN}" "${AGENT_URL}/health")"
echo "${RESPONSE}"

python3 -c "
import json, sys
data = json.loads(sys.argv[1])
assert data.get('status') == 'ok', data
assert data.get('llm_configured') is True, data
print('Portfolio-web to agent communication verified')
" "${RESPONSE}"
