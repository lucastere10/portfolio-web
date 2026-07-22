/** Canonical public URL of the portfolio site. */
export const SITE_URL = (
  process.env.PORTFOLIO_WEB_BASE_URL?.trim() ||
  "https://portfolio.caldasdev.com.br"
).replace(/\/$/, "");
