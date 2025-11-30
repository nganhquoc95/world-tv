# React Environment Setup Guide

## Environment Variables

The project uses Vite for building React, which requires a different approach to environment variables compared to Create React App.

### .env Files

#### `.env` (Development)
```dotenv
VITE_API_URL=http://localhost:3000
VITE_API_PORT=3000
NODE_ENV=development
```

#### `.env.development` (Development Overrides)
```dotenv
VITE_API_URL=http://localhost:3000
VITE_API_PORT=3000
NODE_ENV=development
```

#### `.env.production` (Production - Optional)
```dotenv
VITE_API_URL=https://api.example.com
VITE_API_PORT=443
NODE_ENV=production
```

### Variable Naming Convention

⚠️ **Important**: In Vite, environment variables must be prefixed with `VITE_` to be exposed to client code.

| Framework | Prefix | Example |
|-----------|--------|---------|
| **Create React App** | `REACT_APP_` | `REACT_APP_API_URL` |
| **Vite** | `VITE_` | `VITE_API_URL` |
| **Node/Backend** | (none) | `API_PORT`, `DATABASE_URL` |

### How It Works

1. **Build Time**: Vite reads `.env` files during build
2. **`vite.config.ts`**: Injects variables via `define` option
3. **Runtime**: Variables available as global constants (e.g., `__VITE_API_URL__`)
4. **Fallback**: Code falls back to `window.location.origin` if variable not set

## Configuration in Project

### `vite.config.ts`
```typescript
define: {
    __VITE_API_URL__: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000'),
}
```

### `src/client/services/ApiService.ts`
```typescript
declare const __VITE_API_URL__: string;

const getApiUrl = (): string => {
    // Try Vite-injected global first
    if (typeof __VITE_API_URL__ !== 'undefined') {
        return __VITE_API_URL__;
    }
    
    // Fall back to browser origin
    return window.location.origin || 'http://localhost:3000';
};
```

## Running the App

### Development Mode
```bash
# Runs Vite dev server with React hot reload
# API calls proxied to localhost:3000
npm run client:dev
```

### Server Only
```bash
# Runs Express server serving built React app
npm run server:dev
```

### Build & Serve
```bash
# Build React with production settings
npm run build:client

# Serve the built app
npm run server:dev
```

### Development with Both
```bash
# Runs both server and Vite dev server concurrently
npm run dev
```

## Environment Variables Resolution

The app resolves the API URL in this order:

1. **`__VITE_API_URL__`** - Injected by Vite at build time
2. **`window.location.origin`** - Current browser origin (same host as app)
3. **Fallback** - `http://localhost:3000`

## Key Differences from Create React App

| Feature | CRA | Vite |
|---------|-----|------|
| Env Prefix | `REACT_APP_` | `VITE_` |
| Access | `process.env.REACT_APP_VAR` | `import.meta.env.VITE_VAR` |
| Dev Server | Port 3000 | Port 3001 (configurable) |
| Build Time | Slow | Very fast |
| HMR | Built-in | Built-in |
| Config | `package.json` scripts | `vite.config.ts` |

## Troubleshooting

### "process is not defined" Error
**Problem**: Code using `process.env` in browser context  
**Solution**: Use Vite's injected globals or `window` API instead

### Environment Variables Not Loading
**Problem**: `VITE_` prefixed variables not available  
**Solution**: 
1. Restart the dev server after changing `.env`
2. Verify variable is in `.env` file (not `.env.local`)
3. Check `vite.config.ts` for proper `define` configuration

### API Calls Failing in Production
**Problem**: Hardcoded `http://localhost:3000` used in production  
**Solution**: 
1. Create `.env.production` with correct API URL
2. Rebuild: `npm run build`
3. Deploy the built `/public/dist` folder

## Production Deployment

1. **Set environment variables** in deployment environment:
   ```bash
   VITE_API_URL=https://your-api.com
   ```

2. **Build with environment**:
   ```bash
   npm run build:client
   ```

3. **Serve the built app**:
   ```bash
   npm run server:dev
   ```

The built app in `public/dist/` will use the injected API URL.

## Best Practices

✅ **Do:**
- Prefix environment variables with `VITE_`
- Use `.env` for development defaults
- Use `.env.production` for production config
- Test API URL resolution before deployment

❌ **Don't:**
- Use `process.env` in client-side code
- Expose sensitive credentials in environment variables
- Forget to rebuild after changing `.env`
- Commit `.env.local` to version control

## Examples

### Local Development
```bash
# Terminal 1: Start server
npm run server:dev

# Terminal 2: Start React dev server
npm run client:dev

# Open http://localhost:3001 (React dev server with hot reload)
# API calls proxied to http://localhost:3000
```

### Production Build
```bash
# Build everything
npm run build

# Start serving
npm run server:dev

# Open http://localhost:3000 (serves built React from Express)
```

### Custom API URL
```bash
# Create .env.local
echo "VITE_API_URL=https://api.example.com" > .env.local

# Rebuild
npm run build:client

# Serve
npm run server:dev
```
