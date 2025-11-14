# 🌍 World TV App

A TypeScript application for browsing and selecting TV channels by country or category using the [@iptv-org/database](https://github.com/iptv-org/database) package.

## Features

✨ **Key Features:**
- 📍 **Select channels by country** - Browse all available TV channels for any country
- 🎬 **Select channels by category** - Filter channels by category (News, Sports, Movies, etc.)
- 🔍 **Search channels** - Search for specific channels by name
- 📺 **Detailed channel information** - View channel names, networks, websites, and metadata
- 🗄️ **Real-time database** - Powered by the latest IPTV organization database with 10,000+ channels

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone or navigate to the project directory:
```bash
cd WorldTV
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development Mode
Run the app with hot-reload using ts-node:
```bash
npm run dev
```

Or:
```bash
npm start
```

### Build for Production
Compile TypeScript to JavaScript:
```bash
npm run build
```

Then run the compiled version:
```bash
node dist/index.js
```

## How to Use the App

1. **Start the application** - Run `npm start`
2. **Select an option** from the main menu:
   - **Option 1**: Select channels by country
   - **Option 2**: Select channels by category
   - **Option 3**: Search channels by name
   - **Option 4**: Exit

3. **Browse results** - The app displays detailed information about each channel

### Example: Selecting by Country
```
📍 Available countries...

Countries (200+):
  1. 🇺🇸 United States
  2. 🇬🇧 United Kingdom
  3. 🇫🇷 France
  ...

Enter country name (or part of it): united
```

### Example: Selecting by Category
```
🎬 Available categories...

Categories (30+):
  1. General - Provides a variety of different programming
  2. News - Programming is mostly news
  3. Sports - Programming is sports
  ...

Enter category name or number: sports
```

## Project Structure

```
WorldTV/
├── src/
│   ├── index.ts              # Main application entry point (CLI interface)
│   └── utils/
│       └── ChannelManager.ts # Channel, country, and category management
├── dist/                     # Compiled JavaScript (after build)
├── node_modules/             # Dependencies (including IPTV database)
├── package.json              # Project metadata and scripts
├── tsconfig.json             # TypeScript compiler configuration
├── MODELS.md                 # Data models documentation
├── README.md                 # This file
└── .gitignore                # Git ignore rules
```

## API Reference

### ChannelManager Class

The core class for managing TV channels and related data.

#### Constructor
```typescript
const manager = new ChannelManager();
```

#### Methods

**Data Loading**
- `loadData(): Promise<void>` - Load all channels, countries, categories, and feeds from CSV

**Countries**
- `getCountries(): ICountry[]` - Get all countries sorted by name
- `getCountryByCode(code: string): ICountry | undefined` - Get country by ISO code

**Categories**
- `getCategories(): ICategory[]` - Get all categories sorted by name
- `getCategoryById(id: string): ICategory | undefined` - Get category by ID

**Channels**
- `getChannelsByCountryCode(countryCode: string): IChannel[]` - Get channels for a country
- `getChannelsByCountryName(countryName: string): IChannel[]` - Get channels by country name
- `getChannelsByCategoryId(categoryId: string): IChannel[]` - Get channels for a category
- `getChannelsByCategoryName(categoryName: string): IChannel[]` - Get channels by category name
- `searchChannels(query: string): IChannel[]` - Search channels by name or alt names
- `getChannelById(id: string): IChannel | undefined` - Get a specific channel
- `getAllChannels(): IChannel[]` - Get all channels

**Feeds**
- `getFeedsByChannelId(channelId: string): IFeed[]` - Get streaming feeds for a channel

### Data Interfaces

#### IChannel
```typescript
interface IChannel {
  id: string;                // Channel ID (e.g., "bbc.uk")
  name: string;              // Channel name
  alt_names?: string[];      // Alternative names
  network?: string;          // Network name
  owners?: string[];         // Channel owners
  country: string;           // Country code
  categories?: string[];     // Category IDs
  is_nsfw: boolean;          // NSFW flag
  launched?: string;         // Launch date
  closed?: string;           // Closure date
  replaced_by?: string;      // Replaced by channel
  website?: string;          // Official website
}
```

#### ICountry
```typescript
interface ICountry {
  code: string;              // ISO country code
  name: string;              // Country name
  languages: string[];       // Language codes
  flag: string;              // Country flag emoji
}
```

#### ICategory
```typescript
interface ICategory {
  id: string;                // Category ID
  name: string;              // Category name
  description: string;       // Category description
}
```

#### IFeed
```typescript
interface IFeed {
  channel: string;           // Channel ID
  id: string;                // Feed ID
  name: string;              // Feed name
  alt_names?: string[];      // Alternative names
  is_main: boolean;          // Main feed flag
  broadcast_area?: string[]; // Broadcast areas
  timezones?: string[];      // Timezones
  languages?: string[];      // Languages
  format?: string;           // Video format
}
```

## Data Models Documentation

For detailed information about the data structures and models, see [MODELS.md](MODELS.md).

## Dependencies

- **@iptv-org/database** - IPTV channels database (10,000+ channels)
- **csvtojson** - CSV to JSON parser
- **typescript** - TypeScript compiler
- **ts-node** - Execute TypeScript directly
- **@types/node** - TypeScript definitions for Node.js

## Contributing

Feel free to fork this project and submit pull requests for improvements.

## Related Resources

- [IPTV Organization Database](https://github.com/iptv-org/database)
- [IPTV Organization API](https://github.com/iptv-org/api)
- [Awesome IPTV](https://github.com/iptv-org/awesome-iptv)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

## License

ISC - See LICENSE file for details

The IPTV database is under CC0 (Creative Commons Zero) license - public domain.

---

**Happy streaming! 📺✨**

