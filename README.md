# Jack's Hub

Personal daily dashboards (Daily / Portfolio / Transfers) behind a single password gate.
Built with Next.js, deployed on Vercel. Each dashboard renders from a JSON file in `data/`
that a scheduled task rewrites every weekday morning, then pushes to GitHub — Vercel redeploys automatically.

## How it fits together
- `middleware.js` — gates every route behind the `dash_auth` login cookie.
- `app/login` + `app/api/login` — password screen; a correct password sets a 60-day HttpOnly cookie ("remember me").
- `app/daily` — the daily dashboard, rendered from `data/daily.json`.
- `app/portfolio`, `app/transfers` — stubs for later.
- `data/daily.json` — the only file the morning task edits.

## Environment variables (set in Vercel)
| Name | What it is |
|------|-----------|
| `DASHBOARD_PASSWORD` | The password you type to unlock the site. |
| `AUTH_TOKEN` | A long random string stored in the login cookie. Keep secret. |

## Deploy
1. Push this repo to GitHub.
2. In Vercel: New Project → import the repo → deploy.
3. Add the two environment variables above (Production + Preview).
4. Redeploy. Visit the URL, enter the password, you're in.

## Updating the daily data
The scheduled Cowork task rewrites `data/daily.json` and pushes to `main`.
Vercel redeploys on push, so the site reflects the latest each morning.
