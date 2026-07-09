CREATE OR REPLACE VIEW `${PROJECT_ID}.portfolio_analytics.v_page_views` AS
SELECT
  timestamp,
  path,
  referrer,
  visitor_id,
  session_id,
  cloud_run_service
FROM `${PROJECT_ID}.portfolio_analytics.v_events`
WHERE event = 'page_view';
