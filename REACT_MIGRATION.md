# React Frontend Conversion

## Overview
The World TV frontend has been converted from vanilla JavaScript/HTML to React.js for better component organization, state management, and maintainability.

## Project Structure

```
src/client/
├── components/          # React components
│   ├── App.tsx         # Main App component
│   ├── Header.tsx      # Header with filters
│   ├── Sidebar.tsx     # Channel list sidebar
│   └── Player.tsx      # Video player component
├── hooks/              # Custom React hooks
│   └── useApi.ts       # Data fetching hooks
├── services/           # API services
│   └── ApiService.ts   # API integration
├── styles/             # CSS stylesheets
│   ├── index.css       # Global styles
│   ├── Header.css      # Header styles
│   ├── Sidebar.css     # Sidebar styles
│   ├── Player.css      # Player styles
│   └── App.css         # App styles
├── types/              # TypeScript interfaces
│   └── index.ts        # API and component types
└── index.tsx           # React entry point
```

## Key Features

### Components

#### 1. **App Component** (`src/client/components/App.tsx`)
- Main application component
- State management for filters, search, and channel selection
- Handles data fetching and filtering logic
- Passes data to child components

#### 2. **Header Component** (`src/client/components/Header.tsx`)
- Country filter dropdown (with country names)
- Category filter dropdown
- Search input field
- Responsive design

#### 3. **Sidebar Component** (`src/client/components/Sidebar.tsx`)
- Channel list display
- Channel selection
- Pagination controls
- Statistics display (total channels, groups)
- Responsive scrolling

#### 4. **Player Component** (`src/client/components/Player.tsx`)
- Video player with controls
- HLS.js integration for .m3u8 streams
- Stream URL copy functionality
- Channel metadata display
- Custom HTTP headers support

### Custom Hooks

#### **useChannels()** - Fetches all TV channels
#### **useCountries()** - Fetches country list with names
#### **useCategories()** - Fetches available categories

### Services

#### **ApiService.ts**
- Centralized API communication
- Methods for fetching channels, countries, categories
- Error handling
- Base URL configuration via environment variables

## Dependencies

### Core
- `react@18.2.0` - React library
- `react-dom@18.2.0` - React DOM rendering
- `react-scripts@5.0.1` - React build tools

### Development
- `typescript@5.9.3` - TypeScript support
- `@types/react@18.2.43` - React types
- `@types/react-dom@18.2.17` - React DOM types

### Build Tools
- `concurrently@8.2.2` - Run server and client concurrently

## Running the Application

### Development Mode (Server + Client)
```bash
npm run dev
```
This will:
- Start the Express server on `http://localhost:3000`
- Start the React dev server (typically on `http://localhost:3000`)

### Production Build
```bash
npm run build
```
This will:
- Build the React app for production
- Compile TypeScript server code

### Run Server Only
```bash
npm run server:dev
```

### Run Client Only
```bash
npm run client:dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3000
SKIP_PREFLIGHT_CHECK=true
```

### Variables
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:3000)
- `SKIP_PREFLIGHT_CHECK` - Skip react-scripts checks (required for TypeScript 5.9.3)

## API Integration

The React app communicates with the Express backend via REST API:

- `GET /api/countries` - Fetch all countries
- `GET /api/streams` - Fetch channels
- `GET /api/streams/search` - Search channels
- `GET /api/channels/country/:code` - Channels by country
- `GET /api/channels/category/:category` - Channels by category
- `GET /api/categories` - Fetch categories

## Features

### Filtering
- **By Country**: Select from dropdown showing country names
- **By Category**: Select from available categories
- **Search**: Real-time search across channel names

### Player
- **HLS Support**: Automatic detection and playback of .m3u8 streams
- **Direct Streams**: Support for direct HTTP/MPEG-TS streams
- **Custom Headers**: Automatic application of HTTP referrer/user-agent headers
- **Controls**: Standard video player controls (play, pause, volume, fullscreen)

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Channel logos with fallback
- Country flags and metadata
- Pagination for large channel lists
- Dark theme with gradient accents

## Architecture

### State Management
- Uses React's built-in `useState` for local component state
- Custom hooks (`useChannels`, `useCountries`, `useCategories`) for data fetching
- Memoized computed values for filters and pagination

### Styling
- CSS Modules approach (separate CSS per component)
- Global styles in `index.css`
- Responsive grid and flexbox layouts
- CSS transitions and animations

### Type Safety
- Full TypeScript support
- Strict mode enabled
- Interfaces for API responses
- Component prop interfaces

## Conversion from Vanilla JS

### Before (Vanilla JS)
```javascript
// Old approach - DOM manipulation
document.getElementById('countrySelect').innerHTML = '';
countries.forEach(code => {
    const option = document.createElement('option');
    option.textContent = code;
    select.appendChild(option);
});
```

### After (React)
```jsx
// New approach - Component-based
{countryOptions.map(country => (
    <option key={country.code} value={country.code}>
        {country.name} ({country.code})
    </option>
))}
```

## Performance Optimizations

- **Memoization**: `useMemo` for computed values (filters, country map)
- **Pagination**: Only render 50 channels per page
- **Lazy Loading**: Data fetched on component mount
- **Event Delegation**: React's synthetic event system

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

1. Add Redux for complex state management
2. Implement local storage for user preferences
3. Add favorites/bookmarks feature
4. Implement EPG (Electronic Program Guide)
5. Add streaming quality selection
6. Implement playlist export (M3U)
7. Add dark/light theme toggle
8. Implement multi-language support

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process  # Windows
```

### Dependencies Not Installing
```bash
npm install --legacy-peer-deps
```

### React Dev Server Not Starting
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run client:dev
```

### API Connection Issues
- Ensure Express server is running: `npm run server:dev`
- Check REACT_APP_API_URL in .env file
- Check browser console for CORS errors

## File Structure (Complete)

```
WorldTV/
├── src/
│   ├── client/                    # React frontend
│   │   ├── components/
│   │   │   ├── App.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Player.tsx
│   │   ├── hooks/
│   │   │   └── useApi.ts
│   │   ├── services/
│   │   │   └── ApiService.ts
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── App.css
│   │   │   ├── Header.css
│   │   │   ├── Sidebar.css
│   │   │   └── Player.css
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.tsx
│   ├── server/                    # Express backend
│   │   └── app.ts
│   ├── utils/                     # Shared utilities
│   ├── services/                  # SOLID services
│   └── types/                     # Shared types
├── public/
│   ├── index.html                # Old HTML (deprecated)
│   └── react.html                # React entry HTML
├── package.json
├── tsconfig.json
├── tsconfig.client.json           # React TS config
├── .env                           # Environment variables
└── README.md
```

## Notes

- The old `public/index.html` file is deprecated. The React app uses `public/react.html` or is served directly by react-scripts.
- Both the server and React development servers can run concurrently using `npm run dev`
- The React app automatically proxies API calls to the Express backend based on `.env` configuration
- All styling is responsive and mobile-first
