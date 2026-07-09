CREATE OR REPLACE VIEW `${PROJECT_ID}.portfolio_analytics.v_labs_interactions` AS
SELECT
  timestamp,
  surface,
  action,
  label,
  value,
  visitor_id,
  session_id,
  cloud_run_service
FROM `${PROJECT_ID}.portfolio_analytics.v_events`
WHERE
  event = 'site_interaction'
  AND surface NOT IN ('hero-chat', 'nav', 'footer', 'site')
  AND surface IS NOT NULL;
