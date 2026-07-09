-- Normalized portfolio analytics events from Cloud Run stdout logs.
-- Source table: run_googleapis_com_stdout (created by the Log Router sink).
-- Re-run setup-analytics.sh after changing this file.

CREATE OR REPLACE VIEW `${PROJECT_ID}.portfolio_analytics.v_events` AS
SELECT
  timestamp,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.event'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.event')
  ) AS event,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.service'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.service'),
    'unknown'
  ) AS service,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.visitor_id'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.visitor_id')
  ) AS visitor_id,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.session_id'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.session_id')
  ) AS session_id,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.path'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.path')
  ) AS path,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.referrer'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.referrer')
  ) AS referrer,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.surface'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.surface')
  ) AS surface,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.action'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.action')
  ) AS action,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.label'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.label')
  ) AS label,
  SAFE_CAST(
    COALESCE(
      JSON_VALUE(jsonPayload, '$.value'),
      JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.value')
    ) AS INT64
  ) AS value,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.query_preview'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.query_preview')
  ) AS query_preview,
  SAFE_CAST(
    COALESCE(
      JSON_VALUE(jsonPayload, '$.query_len'),
      JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.query_len')
    ) AS INT64
  ) AS query_len,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.response_preview'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.response_preview')
  ) AS response_preview,
  SAFE_CAST(
    COALESCE(
      JSON_VALUE(jsonPayload, '$.response_len'),
      JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.response_len')
    ) AS INT64
  ) AS response_len,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.tool_used'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.tool_used')
  ) AS tool_used,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.selected_project'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.selected_project')
  ) AS selected_project,
  SAFE_CAST(
    COALESCE(
      JSON_VALUE(jsonPayload, '$.match_count'),
      JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.match_count')
    ) AS INT64
  ) AS match_count,
  SAFE_CAST(
    COALESCE(
      JSON_VALUE(jsonPayload, '$.latency_ms'),
      JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.latency_ms')
    ) AS INT64
  ) AS latency_ms,
  SAFE_CAST(
    COALESCE(
      JSON_VALUE(jsonPayload, '$.status'),
      JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.status')
    ) AS INT64
  ) AS status,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.lang'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.lang')
  ) AS lang,
  COALESCE(
    JSON_VALUE(jsonPayload, '$.error_type'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.error_type')
  ) AS error_type,
  resource.labels.service_name AS cloud_run_service
FROM
  `${PROJECT_ID}.portfolio_analytics.run_googleapis_com_stdout`
WHERE
  COALESCE(
    JSON_VALUE(jsonPayload, '$.message'),
    JSON_VALUE(SAFE.PARSE_JSON(textPayload), '$.message')
  ) = 'portfolio_event';
