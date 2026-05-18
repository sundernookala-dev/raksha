# Raksha — Project Context for Claude Code

## What Raksha Is
Indian Defence Sector Investment Dashboard. Shows stock data for defence companies and aggregates defence news from 8 RSS feeds. Built for tracking India's defence sector stocks and news in one place.

## Location
```
~/raksha/
```

## Tech Stack
- **Language**: Node.js (no framework, plain HTTP module)
- **Frontend**: Static HTML + JSX (`index.html`, `raksha-app.jsx`) served via `npx serve`
- **Backend/Proxy**: `proxy.cjs` — a Node.js proxy server
- **Stock data**: Proxies requests to `stock.indianapi.in`
- **News**: Fetches and filters 8 Indian defence RSS feeds

## Ports
| Service | Port |
|---------|------|
| Frontend (static files) | 3001 |
| Proxy (backend) | 3002 |

## How to Start
**Easiest way** — double-click `Start_Raksha.command` in Finder.

**Manual way:**
```bash
cd ~/raksha

# Kill anything already on the ports first
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start the proxy
node proxy.cjs &

# Serve the frontend
npx serve . -p 3001 &

# Open in browser
open http://localhost:3001
```

## How to Stop
```bash
lsof -ti:3001 | xargs kill -9
lsof -ti:3002 | xargs kill -9
```

## Key Files
| File | Purpose |
|------|---------|
| `proxy.cjs` | Backend proxy — handles stock API calls and RSS news fetching |
| `index.html` | Frontend entry point |
| `raksha-app.jsx` | Main frontend app (React JSX) |
| `Start_Raksha.command` | Double-click launcher for Mac |
| `package.json` | Project metadata and npm scripts |

## What the Proxy Does
- **Stock data**: Passes through API calls to `stock.indianapi.in` (requires an API key in the request headers)
- **Defence news** (`/rss/defence-news`): Fetches RSS from 8 sources, filters articles by defence keywords, deduplicates, sorts by date, and caches results for 10 minutes
  - Add `?fresh=1` to force a cache refresh
- **RSS Sources**: ET Defence, IDRW, Indian Defence News, LiveFist Defence, LiveMint, Hindu BL, India Strategic, Defence Blog

## What NOT to Touch
- Any `.env` files — API keys live there
- `proxy.cjs` API_HOST and RSS feed list without understanding the impact

---
*Updated 2026-05-18 from reading proxy.cjs and Start_Raksha.command*
