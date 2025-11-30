# React Setup & Running Guide

## Quick Start

### Option 1: Development Mode (Recommended for Development)

Run both the Express server and React dev server concurrently:

```bash
npm run dev
```

This will:
- Start Express server at `http://localhost:3000` with API endpoints
- Start React dev server at `http://localhost:3001` with hot reload
- Access the app at `http://localhost:3001`

### Option 2: Server Only with Traditional HTML (Quick Test)

If you just want to test the API quickly:

```bash
npm run server:dev
```

Then open `http://localhost:3000` in your browser.

This serves the traditional HTML/JavaScript interface with all features working.

### Option 3: Build React and Serve from Express

To build React and serve it from Express (production-like):

```bash
npm run build:client
npm run server:dev
```

Then open `http://localhost:3000`

**Note:** React build currently has a dependency issue with `react-scripts`. Use Option 1 or Option 2 instead.

## Current Status

✅ **Server:** Running at port 3000  
✅ **API:** All 16+ endpoints working  
✅ **Traditional HTML:** Fully functional  
✅ **React Components:** Created and ready (400+ lines)  
⚠️ **React Build:** Blocked by react-scripts dependency issue  

## What's Working

- ✅ 38,025 IPTV channels loaded
- ✅ 250 countries with names
- ✅ All filters and search
- ✅ Video streaming with HLS.js
- ✅ Responsive dark theme UI

## Troubleshooting

### React build fails with "Cannot find module 'ajv/dist/compile/codegen'"

This is a known issue with react-scripts 5 + TypeScript 5.9.3.

**Solutions:**
1. Use Option 1 (dev mode) - fully works
2. Use Option 2 (server only) - traditional HTML works perfectly
3. Consider using Vite instead (see vite.config.ts)

### Port 3000 already in use

Kill the process:
```bash
Get-Process node | Stop-Process -Force
```

### Port 3001 not available

Change in package.json:
```json
"client:dev": "react-scripts start --port 3002"
```

## Project Structure

```
src/
├── client/
│   ├── components/     # React components
│   │   ├── App.tsx     # Main component
│   │   ├── Header.tsx  # Filters
│   │   ├── Sidebar.tsx # Channel list
│   │   └── Player.tsx  # Video player
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service
│   ├── types/          # TypeScript types
│   ├── styles/         # Component CSS
│   └── index.tsx       # React entry point
├── server/
│   └── app.ts          # Express server
└── utils/              # Utilities
```

## npm Scripts

- `npm run start` - Run server (no watch)
- `npm run dev` - Run server + React dev server with hot reload
- `npm run server:dev` - Run server only
- `npm run server:watch` - Run server with nodemon watch
- `npm run client:dev` - Run React dev server only
- `npm run build` - Build both server and React
- `npm run build:client` - Build React for production
- `npm run build:server` - Build TypeScript server
- `npm run test` - Run React tests

## Environment Variables

Set in `.env`:
```
REACT_APP_API_URL=http://localhost:3000
NODE_ENV=development
SKIP_PREFLIGHT_CHECK=true
```
