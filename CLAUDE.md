# Raksha — Project Context for Claude Code

## What Raksha Is
Sunder's personal Indian Defence Sector investment dashboard. Runs locally on iMac.
- **Listed Stocks** — Nifty Defence Index stocks with prices, charts, financials, ROE, ROCE, P/E
- **Defence News** — Calendar view of news from 8 RSS feeds (ET Defence, IDRW, LiveFist, etc.)
- **Startups** — Indian defence startups with funding, investors, revenue data
- **Model Portfolio** — 15-20 stock recommendations with weights, corpus allocation, XIRR tracking
- **Portfolio Rebalancing** — Monthly Buy/Hold/Sell recommendations
- **Ratio Analysis** — Compare 3-5 stocks across Balance Sheet, Cash Flow, P&L

⚠️ This is Sunder's REAL money. Be conservative. Never hallucinate financial data.

## Location
```
~/raksha/
├── proxy.cjs        ← Node.js backend proxy (port 3002)
├── raksha-app.jsx   ← React frontend (entire app in one file)
├── index.html       ← Loads the React app via CDN
├── package.json
└── CLAUDE.md
```

## Tech Stack
- **Frontend**: React 18 (loaded via CDN, no build step needed)
- **Backend**: Node.js proxy (`proxy.cjs`) — pure Node, no npm packages needed
- **Stock Data**: IndianAPI (`stock.indianapi.in`) — proxied through backend
- **News**: 8 RSS feeds — ET Defence, IDRW, Indian Defence News, LiveFist, LiveMint, Hindu BL, India Strategic, Defence Blog
- **Charts**: Recharts (CDN)
- **Ports**: Proxy on 3002, frontend served separately

## How to Run

### Start the proxy (backend):
```bash
cd ~/raksha
node proxy.cjs
```

### Serve the frontend:
Open a second Terminal tab:
```bash
cd ~/raksha
npx serve . -p 3001
```
Then open http://localhost:3001 in browser.

### Or open index.html directly:
```bash
open ~/raksha/index.html
```
Note: Some features may not work when opened directly due to CORS. Use `npx serve` for full functionality.

## How to Stop
```bash
# Stop proxy
lsof -ti:3002 | xargs kill -9

# Stop frontend server
lsof -ti:3001 | xargs kill -9
```

## Key Files
- `proxy.cjs` — fetches stock data from IndianAPI, parses RSS news feeds, caches results 10 min
- `raksha-app.jsx` — entire React frontend (592 lines), all UI components inside
- `index.html` — loads React + Babel + Recharts from CDN, mounts the app

## IndianAPI
- Host: `stock.indianapi.in`
- The proxy forwards all requests to this API
- No API key configured yet — add to proxy.cjs headers if needed

## Nifty Defence Index Stocks (hardcoded in raksha-app.jsx)
BEL, HAL, SOLARINDS, MAZDOCK, BHARATFORG, BDL, COCHINSHIP, GRSE, DATAPATTNS, ZENTEC, BEML, MTAR, ASTRAMICRO, DYNAMATECH, MIDHANI, PARAS, CYIENTDLM

## News RSS Feeds (in proxy.cjs)
ET Defence, IDRW, Indian Defence News, LiveFist Defence, LiveMint, Hindu BL, India Strategic, Defence Blog

## What NOT to Touch
- Never fabricate stock prices or financial data
- Never change the API_HOST without testing
- Keep the news cache TTL (10 min) to avoid hammering RSS feeds

## Common Tasks Claude Code Will Do
- Add new stocks to NIFTY list in raksha-app.jsx
- Add new RSS feeds to proxy.cjs
- Fix API fetch errors
- Improve charts or UI sections
- Add new portfolio features
