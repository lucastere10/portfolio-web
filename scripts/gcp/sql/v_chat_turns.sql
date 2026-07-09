CREATE OR REPLACE VIEW `${PROJECT_ID}.portfolio_analytics.v_chat_turns` AS
SELECT
  timestamp,
  session_id,
  lang,
  query_preview,
  query_len,
  response_preview,
  response_len,
  tool_used,
  selected_project,
  match_count,
  latency_ms,
  error_type,
  cloud_run_service
FROM `${PROJECT_ID}.portfolio_analytics.v_events`
WHERE event IN ('chat_turn', 'chat_proxy', 'chat_error');
