# IPTV Database Models Documentation

This document describes the data models used in the World TV App, which are based on the [@iptv-org/database](https://github.com/iptv-org/database) package.

## Overview

The IPTV database consists of several interconnected models stored as CSV files:

- **Channels** - TV channels with metadata
- **Countries** - Country information
- **Categories** - Content categories
- **Feeds** - Streaming feeds/URLs for channels
- **Languages** - Available languages
- **Regions, Subdivisions, Cities** - Geographic divisions
- **Timezones** - Timezone information

## Data Models

### Channel Model

Represents a television channel with its metadata.

**CSV File:** `channels.csv`

**Properties:**
```typescript
interface IChannel {
  id: string;                    // Unique channel ID (format: "name.countrycode", e.g., "bbc.uk")
  name: string;                  // Channel name (e.g., "BBC One")
  alt_names?: string[];          // Alternative names (semicolon-separated in CSV)
  network?: string;              // Network name (e.g., "BBC")
  owners?: string[];             // Channel owners (semicolon-separated in CSV)
  country: string;               // Country code (e.g., "GB", "US")
  categories?: string[];         // Category IDs (semicolon-separated in CSV)
  is_nsfw: boolean;              // Is Not Safe For Work content
  launched?: string;             // Launch date (YYYY-MM-DD format)
  closed?: string;               // Closure date (YYYY-MM-DD format)
  replaced_by?: string;          // Channel ID this channel was replaced by
  website?: string;              // Official website URL
}
```

**Example CSV Row:**
```csv
id,name,alt_names,network,owners,country,categories,is_nsfw,launched,closed,replaced_by,website
BBC.uk,BBC One,,BBC,,GB,general,FALSE,,,,https://www.bbc.co.uk/
```

### Country Model

Represents a country with language and flag information.

**CSV File:** `countries.csv`

**Properties:**
```typescript
interface ICountry {
  code: string;                  // ISO 3166-1 alpha-2 country code (e.g., "US", "GB")
  name: string;                  // Country name (e.g., "United States")
  languages: string[];           // List of language codes (semicolon-separated in CSV)
  flag: string;                  // Country flag emoji
}
```

**Example CSV Row:**
```csv
name,code,languages,flag
Afghanistan,AF,pus;prd;tuk,🇦🇫
```

### Category Model

Represents a content category for channels.

**CSV File:** `categories.csv`

**Properties:**
```typescript
interface ICategory {
  id: string;                    // Unique category ID (e.g., "news", "sports")
  name: string;                  // Category display name (e.g., "News", "Sports")
  description: string;           // Category description
}
```

**Example CSV Row:**
```csv
id,name,description
news,News,Programming is mostly news
sports,Sports,Programming is sports
```

### Feed Model

Represents a streaming feed/URL for a channel with broadcast details.

**CSV File:** `feeds.csv`

**Properties:**
```typescript
interface IFeed {
  channel: string;               // Channel ID this feed belongs to
  id: string;                    // Unique feed ID within the channel
  name: string;                  // Feed name/language (e.g., "HD", "SD")
  alt_names?: string[];          // Alternative feed names (semicolon-separated)
  is_main: boolean;              // Is this the main feed for the channel
  broadcast_area?: string[];     // Broadcast area codes (c/country, s/subdivision, etc.)
  timezones?: string[];          // Timezones where feed broadcasts (semicolon-separated)
  languages?: string[];          // Languages in the feed (semicolon-separated)
  format?: string;               // Video format (e.g., "1080p", "720i")
}
```

**Example CSV Row:**
```csv
channel,id,name,alt_names,is_main,broadcast_area,timezones,languages,format
BBC.uk,HD,HD,,TRUE,c/GB,Europe/London,eng,1080p
```

## CSV Data Format Details

### Array Data (Semicolon-Separated)

Many properties contain multiple values separated by semicolons in CSV files:

```csv
alt_names=Channel One;First Channel;Ch1
owners=Owner A;Owner B
categories=news;sports;entertainment
languages=eng;fra;spa
```

These are parsed into TypeScript arrays:
```typescript
altNames = ["Channel One", "First Channel", "Ch1"]
owners = ["Owner A", "Owner B"]
categories = ["news", "sports", "entertainment"]
languages = ["eng", "fra", "spa"]
```

### Boolean Data

Booleans in CSV are represented as "TRUE" or "FALSE" (uppercase) and parsed to JavaScript booleans:

```csv
is_nsfw=TRUE      → is_nsfw: boolean = true
is_nsfw=FALSE     → is_nsfw: boolean = false
```

### Date Format

Dates are stored in YYYY-MM-DD format or left empty (null):

```csv
launched=2020-01-15  → "2020-01-15"
launched=             → undefined
```

## Data Relationships

```
Country (code)
  ├── Channel (country) ──┬── Feed (channel)
  │                       └── Categories (categories)
  └── Languages (languages)

Category (id)
  └── Channel (categories)
```

## File Locations

When the app is running, CSV files are located at:
```
node_modules/@iptv-org/database/data/
├── channels.csv
├── countries.csv
├── categories.csv
├── feeds.csv
├── languages.csv
├── regions.csv
├── subdivisions.csv
├── cities.csv
├── timezones.csv
└── logos.csv
```

## Data Statistics (as of last update)

- **Channels:** 10,000+ TV channels
- **Countries:** 200+ countries
- **Categories:** 30+ content categories
- **Feeds:** 30,000+ streaming feeds
- **Languages:** 200+ languages

## Using the Models in Code

```typescript
import ChannelManager, { IChannel, ICountry, ICategory, IFeed } from './utils/ChannelManager';

const manager = new ChannelManager();
await manager.loadData();

// Get channels by country
const channels: IChannel[] = manager.getChannelsByCountryCode('US');

// Get channels by category
const newsChannels: IChannel[] = manager.getChannelsByCategoryId('news');

// Get country information
const country: ICountry | undefined = manager.getCountryByCode('GB');

// Get feeds for a channel
const feeds: IFeed[] = manager.getFeedsByChannelId('BBC.uk');

// Search channels
const results: IChannel[] = manager.searchChannels('BBC');
```

## Database Source

All data is maintained by the [IPTV Organization](https://github.com/iptv-org) and is community-driven. The database is updated regularly through:

- [GitHub Repository](https://github.com/iptv-org/database)
- [API Documentation](https://github.com/iptv-org/api)
- [Contributing Guide](https://github.com/iptv-org/database/blob/master/CONTRIBUTING.md)

## License

The IPTV database is under the CC0 (Creative Commons Zero) license - public domain.
