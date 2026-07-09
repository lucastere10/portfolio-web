CREATE OR REPLACE VIEW `${PROJECT_ID}.portfolio_analytics.v_chat_funnel` AS
SELECT
  timestamp,
  session_id,
  visitor_id,
  surface,
  action,
  label,
  value,
  cloud_run_service
FROM `${PROJECT_ID}.portfolio_analytics.v_events`
WHERE
  event = 'site_interaction'
  AND surface = 'hero-chat'
  AND action IN (
    'chat_opened',
    'message_sent',
    'message_received',
    'chat_error',
    'match_click',
    'content_link_click'
  );
