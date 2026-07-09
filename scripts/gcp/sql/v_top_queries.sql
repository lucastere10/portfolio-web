CREATE OR REPLACE VIEW `${PROJECT_ID}.portfolio_analytics.v_top_queries` AS
SELECT
  query_preview,
  lang,
  COUNT(*) AS turn_count,
  AVG(latency_ms) AS avg_latency_ms,
  APPROX_TOP_COUNT(tool_used, 1)[OFFSET(0)].value AS top_tool_used,
  APPROX_TOP_COUNT(selected_project, 1)[OFFSET(0)].value AS top_selected_project
FROM `${PROJECT_ID}.portfolio_analytics.v_events`
WHERE
  event = 'chat_turn'
  AND query_preview IS NOT NULL
  AND query_preview != ''
GROUP BY query_preview, lang
ORDER BY turn_count DESC;
