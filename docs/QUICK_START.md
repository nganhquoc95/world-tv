# Quick Start Guide

## Installation & Setup

```bash
# Install dependencies
npm install

# Build the project (optional, for production)
npm run build
```

## Running the App

```bash
# Development mode (recommended)
npm start

# Or use the dev script
npm run dev
```

## What You'll See

When you start the app, you'll get an interactive menu:

```
╔══════════════════════════════════════════════════════════════╗
║                      🌍 WORLD TV APP 📺                      ║
╚══════════════════════════════════════════════════════════════╝

Please select an option:
  1. Select channels by country
  2. Select channels by category
  3. Search channels
  4. Exit

Enter your choice (1-4):
```

## Features Demo

### 1. Select Channels by Country

```
📍 Available countries...

Countries (200+):
  1. 🇺🇸 United States
  2. 🇬🇧 United Kingdom
  3. 🇦🇪 United Arab Emirates
  ...

Enter country name (or part of it): united states
```

The app will display all channels from the selected country with details:
- Channel ID
- Channel name
- Network information
- Alternative names
- Website
- Categories
- NSFW warning (if applicable)

### 2. Select Channels by Category

```
🎬 Available categories...

Categories (30+):
  1. general - Provides a variety of different programming
  2. news - Programming is mostly news
  3. sports - Programming is sports
  4. movies - Channels that only show movies
  ...

Enter category name or number: sports
```

The app shows all channels in that category with their details.

### 3. Search Channels

```
🔍 Enter search term: BBC
```

Searches across all channels and alternative names, returning matching results.

## Project Structure

```
WorldTV/
├── src/
│   ├── index.ts                    # CLI application interface
│   └── utils/
│       └── ChannelManager.ts       # Data management logic
├── dist/                           # Compiled JavaScript (generated after npm run build)
├── node_modules/                   # Dependencies
├── package.json                    # Project configuration
├── tsconfig.json                   # TypeScript settings
├── README.md                       # Full documentation
├── MODELS.md                       # Data model documentation
└── QUICK_START.md                  # This file
```

## Key Technologies

- **TypeScript** - Type-safe JavaScript
- **Node.js** - Runtime environment
- **@iptv-org/database** - TV channel database (10,000+ channels)
- **csvtojson** - CSV parsing library
- **Readline** - Interactive CLI

## Data Available

The app has access to:
- **10,000+** TV channels
- **200+** countries
- **30+** content categories
- **30,000+** streaming feeds
- **200+** languages

## Extending the App

To add new features, modify `src/utils/ChannelManager.ts`:

```typescript
// Example: Add a method to get channels by network name
getChannelsByNetwork(networkName: string): IChannel[] {
  return this.channels
    .filter(ch => ch.network?.toLowerCase() === networkName.toLowerCase())
    .sort((a, b) => a.name.localeCompare(b.name));
}
```

Then rebuild:
```bash
npm run build
```

## Building for Production

```bash
# Build TypeScript to JavaScript
npm run build

# Run the compiled version
node dist/index.js
```

## Troubleshooting

### "Database not found"
- Make sure `node_modules/@iptv-org/database/data/` directory exists
- Run `npm install` to reinstall dependencies

### "Cannot find module"
- Clear node_modules: `rm -r node_modules` (or delete folder on Windows)
- Reinstall: `npm install`

### TypeScript errors
- Rebuild: `npm run build`
- Check `tsconfig.json` settings

## Learning Resources

- [IPTV Database GitHub](https://github.com/iptv-org/database)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [CSV Format](https://en.wikipedia.org/wiki/Comma-separated_values)

## Next Steps

1. ✅ Install and run the app
2. 📺 Browse channels by country
3. 🎬 Filter by category
4. 🔍 Search for specific channels
5. 📝 Modify and extend the code
6. 🚀 Deploy to production (see README.md for details)

---

**Enjoy exploring TV channels worldwide! 🌍📺**
