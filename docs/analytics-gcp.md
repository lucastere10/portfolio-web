# Portfolio Analytics on GCP

Pipeline for analyzing visitor behavior and agent Q&A interactions using **Cloud Logging → BigQuery → Looker Studio**.

## Architecture

```
Browser → POST /api/analytics (page_view, site_interaction)
Browser → POST /api/agent/chat → portfolio-agent
         ↓ structured JSON logs (message: "portfolio_event")
Cloud Run stdout → Cloud Logging
         ↓ Log Router sink
BigQuery dataset: portfolio_analytics
         ↓ SQL views
Looker Studio dashboards
```

Both services emit logs with a unified schema:

| Field | Description |
|-------|-------------|
| `event` | `page_view`, `site_interaction`, `chat_proxy`, `chat_turn`, `chat_error` |
| `service` | `portfolio-web` or `portfolio-agent` |
| `visitor_id` | Anonymous UUID from browser localStorage |
| `session_id` | Agent session (hashed in agent logs) |
| `timestamp` | ISO-8601 |

**Privacy:** Only query/response **previews** (120 chars) are logged — never full Q&A text.

## One-time GCP setup

From the portfolio repo root, with `gcloud` authenticated:

```bash
chmod +x scripts/gcp/setup-analytics.sh
./scripts/gcp/setup-analytics.sh YOUR_PROJECT_ID
```

This creates:

- BigQuery dataset `portfolio_analytics`
- Log Router sink `portfolio-analytics-sink` (Cloud Run stdout → BigQuery)
- Views: `v_events`, `v_page_views`, `v_chat_funnel`, `v_chat_turns`, `v_top_queries`, `v_labs_interactions`
- Log-based metric `portfolio_chat_errors` (optional alerts)

**Note:** The sink table `run_googleapis_com_stdout` is created automatically when the first matching log arrives. Re-run the script if view creation fails on first attempt.

## Cloud Logging filters

Quick checks in [Logs Explorer](https://console.cloud.google.com/logs):

```
resource.type="cloud_run_revision"
jsonPayload.message="portfolio_event"
```

By event type:

```
jsonPayload.event="page_view"
jsonPayload.event="site_interaction"
jsonPayload.event="chat_turn"
jsonPayload.event="chat_proxy"
```

By service:

```
jsonPayload.service="portfolio-web"
jsonPayload.service="portfolio-agent"
```

Hero chat funnel (site-side):

```
jsonPayload.event="site_interaction"
jsonPayload.surface="hero-chat"
```

## BigQuery verification queries

After traffic and a few minutes of sink latency:

```sql
-- Event counts by type
SELECT event, service, COUNT(*) AS n
FROM `YOUR_PROJECT.portfolio_analytics.v_events`
WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
GROUP BY 1, 2
ORDER BY n DESC;
```

```sql
-- Top pages (last 7 days)
SELECT path, COUNT(*) AS views, COUNT(DISTINCT visitor_id) AS visitors
FROM `YOUR_PROJECT.portfolio_analytics.v_page_views`
WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
GROUP BY 1
ORDER BY views DESC
LIMIT 20;
```

```sql
-- Chat funnel conversion
SELECT
  action,
  COUNT(*) AS events,
  COUNT(DISTINCT session_id) AS sessions
FROM `YOUR_PROJECT.portfolio_analytics.v_chat_funnel`
WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
GROUP BY 1
ORDER BY events DESC;
```

```sql
-- Agent latency P50 / P95
SELECT
  APPROX_QUANTILES(latency_ms, 100)[OFFSET(50)] AS p50_ms,
  APPROX_QUANTILES(latency_ms, 100)[OFFSET(95)] AS p95_ms,
  COUNT(*) AS turns
FROM `YOUR_PROJECT.portfolio_analytics.v_chat_turns`
WHERE event = 'chat_turn'
  AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY);
```

```sql
-- Top query themes
SELECT query_preview, turn_count, avg_latency_ms, top_selected_project
FROM `YOUR_PROJECT.portfolio_analytics.v_top_queries`
LIMIT 25;
```

## Looker Studio dashboard

### Connect data

1. Go to [Looker Studio](https://lookerstudio.google.com/)
2. **Create → Report → BigQuery**
3. Select project `YOUR_PROJECT`, dataset `portfolio_analytics`
4. Add each view as a separate data source (or one blended source)

### Recommended pages

#### Page 1 — Tráfego

| Chart | Data source | Config |
|-------|-------------|--------|
| Scorecard: Total page views | `v_page_views` | Metric: `COUNT(timestamp)` |
| Scorecard: Unique visitors | `v_page_views` | Metric: `COUNT_DISTINCT(visitor_id)` |
| Time series | `v_page_views` | Dimension: `timestamp` (day), Metric: count |
| Table: Top pages | `v_page_views` | Dimension: `path`, Metric: count, sort desc |
| Bar: Views by path | `v_page_views` | Top 10 paths |

**Filter:** Date range control on `timestamp`.

#### Page 2 — Hero Chat

| Chart | Data source | Config |
|-------|-------------|--------|
| Funnel / bar chart | `v_chat_funnel` | Dimension: `action`, Metric: `COUNT_DISTINCT(session_id)` |
| Scorecard: Chat errors | `v_chat_funnel` | Filter `action = chat_error`, count |
| Time series: messages sent | `v_chat_funnel` | Filter `action = message_sent` |
| Latency line chart | `v_chat_turns` | Filter `event = chat_turn`, metric: `AVG(latency_ms)` |
| Pie: tool_used | `v_chat_turns` | Dimension: `tool_used` |

Suggested funnel order: `chat_opened` → `message_sent` → `message_received` → `match_click` → `content_link_click`.

#### Page 3 — Conteúdo

| Chart | Data source | Config |
|-------|-------------|--------|
| Table: Top queries | `v_top_queries` | Columns: query_preview, turn_count, avg_latency_ms |
| Bar: Selected projects | `v_chat_turns` | Dimension: `selected_project`, filter not null |
| Table: Match clicks | `v_chat_funnel` | Filter `action = match_click`, dimension: `label` |

#### Page 4 — Labs

| Chart | Data source | Config |
|-------|-------------|--------|
| Bar: Demos by surface | `v_labs_interactions` | Dimension: `surface`, metric: count |
| Table: Top actions | `v_labs_interactions` | Dimensions: surface, action, label |

### Global controls

Add a **date range** control bound to `timestamp` on each page. Optional: filter by `lang` on chat pages.

## Event reference (client-side)

| Event | Surface | Action | When |
|-------|---------|--------|------|
| `page_view` | — | — | Every route change |
| `site_interaction` | `hero-chat` | `chat_opened` | First chat open |
| `site_interaction` | `hero-chat` | `message_sent` | User sends message |
| `site_interaction` | `hero-chat` | `message_received` | Agent responds |
| `site_interaction` | `hero-chat` | `chat_error` | Chat request fails |
| `site_interaction` | `hero-chat` | `match_click` | User selects a match card |
| `site_interaction` | `hero-chat` | `content_link_click` | User opens project/lab link |
| `site_interaction` | `{lab-slug}` | various | Lab demo interactions |
| `site_interaction` | `nav` / `footer` | `nav_click` | Navigation clicks |

## Server-side events

| Event | Service | When |
|-------|---------|------|
| `chat_proxy` | portfolio-web | BFF proxies chat to agent |
| `chat_turn` | portfolio-agent | Agent completes a turn |
| `chat_error` | portfolio-agent | ADK/LLM failure |

## Retention

- **Cloud Logging:** default 30 days (buffer)
- **BigQuery:** configure partition expiration on the sink table in the GCP console (recommended: 90–180 days)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| No rows in `v_events` | Confirm deploy includes structured logging; check Logs Explorer for `portfolio_event` |
| Views fail to create | Wait for first logs in `run_googleapis_com_stdout`, re-run setup script |
| `bq: python3.14: command not found` | Script auto-detects Python via `py -3`. Or set manually: `export CLOUDSDK_PYTHON="$(py -3 -c 'import sys; print(sys.executable)')"` |
| Looker shows no data | Refresh data source; check date range filter |
| Duplicate page views | Expected on hard refresh; use `COUNT_DISTINCT` for sessions |

## Code references

- Client tracking: `src/lib/labs-analytics.ts`
- Server log helper: `src/lib/structured-log.ts`
- Analytics API: `src/app/api/analytics/route.ts`
- Chat BFF logging: `src/app/api/agent/chat/route.ts`
- Agent logging: `portfolio-agent/src/observability/logging.py`
