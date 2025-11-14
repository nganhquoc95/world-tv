# World TV REST API Documentation

## Overview

Complete REST API for browsing and streaming TV channels from around the world. Built with Express.js and TypeScript.

**Base URL:** `http://localhost:3000/api`

**Version:** 2.0.0

**Authentication:** None required

---

## Quick Start

### 1. API Documentation
```bash
GET /api
```
Returns complete API specification and endpoints.

### 2. Health Check
```bash
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "World TV API is running"
}
```

### 3. API Test
```bash
GET /api/test
```

Comprehensive test of all API endpoints. Returns status of all major functions.

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-11-14T12:00:00.000Z",
  "version": "2.0.0",
  "tests": {
    "health": { "status": "ok", "message": "..." },
    "countries": { "status": "ok", "message": "...", "data": {...} },
    "categories": { "status": "ok", "message": "...", "data": {...} },
    "channels": { "status": "ok", "message": "...", "data": {...} },
    "streams": { "status": "ok", "message": "...", "data": {...} },
    "search": { "status": "ok", "message": "...", "data": {...} }
  }
}
```

---

## Endpoints

### Countries

#### Get All Countries
```
GET /api/countries
```

**Description:** Get list of all countries with TV channels.

**Parameters:** None

**Response:**
```json
{
  "success": true,
  "count": 250,
  "data": [
    {
      "code": "US",
      "name": "United States",
      "languages": ["en"],
      "flag": "🇺🇸"
    },
    {
      "code": "GB",
      "name": "United Kingdom",
      "languages": ["en"],
      "flag": "🇬🇧"
    }
  ]
}
```

---

### Categories

#### Get All Categories
```
GET /api/categories
```

**Description:** Get list of all channel categories.

**Parameters:** None

**Response:**
```json
{
  "success": true,
  "count": 30,
  "data": [
    {
      "id": "news",
      "name": "News",
      "description": "News and current events"
    },
    {
      "id": "sports",
      "name": "Sports",
      "description": "Sports channels and events"
    }
  ]
}
```

---

### Channels (IPTV Database)

#### Get All Channels (Paginated)
```
GET /api/channels?page=1&limit=50
```

**Description:** Get paginated list of all channels from IPTV database.

**Query Parameters:**
- `page` (number, optional): Page number. Default: 1
- `limit` (number, optional): Results per page. Default: 50

**Response:**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 38025,
    "pages": 761
  },
  "count": 50,
  "data": [
    {
      "id": "abc123",
      "name": "Channel Name",
      "alt_names": ["Alternative Name"],
      "network": "Network Name",
      "owners": ["Owner1"],
      "country": "US",
      "categories": ["news", "sports"],
      "is_nsfw": false,
      "launched": "2020-01-01",
      "closed": null,
      "replaced_by": null,
      "website": "http://example.com"
    }
  ]
}
```

#### Get Channel by ID
```
GET /api/channels/:id
```

**Description:** Get details of a specific channel.

**Path Parameters:**
- `id` (string, required): Channel ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "Channel Name",
    "country": "US",
    "categories": ["news"],
    "is_nsfw": false
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Channel not found"
}
```

#### Get Channel Play URL
```
GET /api/channels/:id/play
```

**Description:** Get streaming URL for a channel from parsed M3U streams.

**Path Parameters:**
- `id` (string, required): Channel ID

**Response:**
```json
{
  "success": true,
  "channelId": "abc123",
  "channelName": "BBC News",
  "url": "http://stream.example.com/bbc-news.m3u8",
  "logo": "http://logo.example.com/bbc.png",
  "group": "UK",
  "countryCode": "GB",
  "quality": "1080p"
}
```

#### Get Channel Feeds
```
GET /api/channels/:id/feeds
```

**Description:** Get alternative feeds/streams for a channel.

**Path Parameters:**
- `id` (string, required): Channel ID

**Response:**
```json
{
  "success": true,
  "channelId": "abc123",
  "count": 3,
  "data": [
    {
      "channel": "abc123",
      "id": "feed1",
      "name": "Feed 1",
      "is_main": true,
      "broadcast_area": ["Europe"]
    }
  ]
}
```

#### Get Channels by Country Code
```
GET /api/channels/country/:code?page=1&limit=50
```

**Description:** Get channels from a specific country by country code.

**Path Parameters:**
- `code` (string, required): Country code (e.g., 'US', 'GB', 'FR')

**Query Parameters:**
- `page` (number, optional): Page number. Default: 1
- `limit` (number, optional): Results per page. Default: 50

**Response:**
```json
{
  "success": true,
  "countryCode": "US",
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 500,
    "pages": 10
  },
  "count": 50,
  "data": [...]
}
```

#### Get Channels by Country Name
```
GET /api/channels/country-name?name=United%20States&page=1&limit=50
```

**Description:** Get channels from a specific country by country name.

**Query Parameters:**
- `name` (string, required): Country name (e.g., 'United States', 'United Kingdom')
- `page` (number, optional): Page number. Default: 1
- `limit` (number, optional): Results per page. Default: 50

**Response:**
```json
{
  "success": true,
  "countryName": "United States",
  "countryCode": "US",
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 500,
    "pages": 10
  },
  "count": 50,
  "data": [...]
}
```

#### Get Channels by Category
```
GET /api/channels/category/:id?page=1&limit=50
```

**Description:** Get channels from a specific category.

**Path Parameters:**
- `id` (string, required): Category ID (e.g., 'news', 'sports', 'entertainment')

**Query Parameters:**
- `page` (number, optional): Page number. Default: 1
- `limit` (number, optional): Results per page. Default: 50

**Response:**
```json
{
  "success": true,
  "categoryId": "news",
  "categoryName": "News",
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1200,
    "pages": 24
  },
  "count": 50,
  "data": [...]
}
```

#### Search Channels
```
GET /api/channels/search?q=BBC&page=1&limit=50
```

**Description:** Search channels by name or metadata.

**Query Parameters:**
- `q` (string, required): Search query
- `page` (number, optional): Page number. Default: 1
- `limit` (number, optional): Results per page. Default: 50

**Response:**
```json
{
  "success": true,
  "query": "BBC",
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 234,
    "pages": 5
  },
  "count": 50,
  "data": [...]
}
```

---

### Streams (Parsed M3U)

#### Get All Parsed Streams
```
GET /api/streams?page=1&limit=50
```

**Description:** Get paginated list of all parsed stream channels from M3U file.

**Query Parameters:**
- `page` (number, optional): Page number. Default: 1
- `limit` (number, optional): Results per page. Default: 50

**Response:**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 10000,
    "pages": 200
  },
  "count": 50,
  "data": [
    {
      "tvgId": "uk.bbc.news",
      "tvgLogo": "http://logo.example.com/bbc-news.png",
      "groupTitle": "UK",
      "name": "BBC News",
      "countryCode": "GB",
      "quality": "1080p",
      "url": "http://stream.example.com/bbc-news.m3u8"
    }
  ]
}
```

#### Search Streams
```
GET /api/streams/search?q=BBC
```

**Description:** Search parsed streams by name or group title.

**Query Parameters:**
- `q` (string, required): Search query

**Response:**
```json
{
  "success": true,
  "query": "BBC",
  "count": 25,
  "data": [
    {
      "tvgId": "uk.bbc.news",
      "tvgLogo": "http://logo.example.com/bbc-news.png",
      "groupTitle": "UK",
      "name": "BBC News",
      "countryCode": "GB",
      "quality": "1080p",
      "url": "http://stream.example.com/bbc-news.m3u8"
    }
  ]
}
```

---

### Playback

#### Get Play URL for Channel
```
GET /api/channels/:id/play
```

**Description:** Get the streaming URL for a channel (same as channels/:id/play endpoint above).

#### Stream/Proxy Channel
```
GET /api/play?url=<stream_url>&channelId=<id>
```

**Description:** Proxy/stream a channel. Redirects to the actual stream URL.

**Query Parameters:**
- `url` (string, required): Stream URL to play
- `channelId` (string, optional): Channel ID for validation

**Response:** HTTP 302 Redirect to the stream URL

**Example:**
```bash
curl -L "http://localhost:3000/api/play?url=http://stream.example.com/channel.m3u8&channelId=abc123"
```

---

## Request Examples

### cURL

#### Get health status
```bash
curl http://localhost:3000/api/health
```

#### Search for BBC channels
```bash
curl "http://localhost:3000/api/channels/search?q=BBC"
```

#### Get US channels (first page)
```bash
curl "http://localhost:3000/api/channels/country/US?page=1&limit=10"
```

#### Get news channels
```bash
curl "http://localhost:3000/api/channels/category/news?page=1&limit=20"
```

#### Run API tests
```bash
curl http://localhost:3000/api/test
```

### JavaScript/Fetch

```javascript
// Get all countries
fetch('/api/countries')
  .then(res => res.json())
  .then(data => console.log(data));

// Search channels
fetch('/api/channels/search?q=BBC')
  .then(res => res.json())
  .then(data => console.log(data));

// Get channel by ID and play
fetch('/api/channels/abc123/play')
  .then(res => res.json())
  .then(data => console.log(data.url));
```

### Python

```python
import requests

# Get all countries
response = requests.get('http://localhost:3000/api/countries')
data = response.json()
print(data)

# Search channels
response = requests.get('http://localhost:3000/api/channels/search', 
                       params={'q': 'BBC'})
data = response.json()
print(data)
```

---

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "count": 50,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000,
    "pages": 20
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Missing or invalid parameters |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## Pagination

Endpoints that support pagination use these parameters:

- `page` (default: 1): Current page number
- `limit` (default: 50): Results per page

**Example:**
```bash
GET /api/channels?page=2&limit=25
```

Returns results 26-50 (second page with 25 items per page).

---

## Filtering & Search

### By Country
- **Code:** `/api/channels/country/:code`
- **Name:** `/api/channels/country-name?name=United%20States`

### By Category
- **By ID:** `/api/channels/category/:id`

### Search
- **Channels:** `/api/channels/search?q=query`
- **Streams:** `/api/streams/search?q=query`

---

## Rate Limiting

No rate limiting is currently applied. Please use the API responsibly.

---

## CORS

CORS is enabled. You can make requests from any origin.

---

## Error Handling

All errors are returned with appropriate HTTP status codes and error messages:

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

Common errors:
- 400: Missing required parameters
- 404: Resource not found
- 500: Server error

---

## Performance Tips

1. **Use pagination** for large result sets
2. **Cache results** on the client side
3. **Limit pagination size** to 50-100 items per request
4. **Use search** instead of fetching all items
5. **Filter by country/category** before searching

---

## Data Models

### Channel
```typescript
{
  id: string;
  name: string;
  alt_names?: string[];
  network?: string;
  owners?: string[];
  country: string;
  categories?: string[];
  is_nsfw: boolean;
  launched?: string;
  closed?: string;
  replaced_by?: string;
  website?: string;
}
```

### Country
```typescript
{
  code: string;
  name: string;
  languages: string[];
  flag: string;
}
```

### Category
```typescript
{
  id: string;
  name: string;
  description: string;
}
```

### Stream (M3U)
```typescript
{
  tvgId: string;
  tvgLogo: string;
  groupTitle: string;
  name: string;
  countryCode: string;
  quality: string;
  url: string;
}
```

---

## Troubleshooting

### No response from API
- Check if server is running: `GET /api/health`
- Verify port 3000 is accessible
- Check firewall settings

### Invalid channel ID
- Use `/api/channels/search?q=channel_name` to find valid IDs
- Channel IDs are case-sensitive

### Empty search results
- Try shorter search terms
- Check spelling
- Try searching in different fields (name, category, country)

### Pagination issues
- Minimum page: 1
- Maximum items per page: usually 50-100
- Total pages calculated as: `ceil(total / limit)`

---

## Support

For issues or suggestions, create an issue in the repository.

---

**Last Updated:** November 14, 2025  
**Version:** 2.0.0  
**Status:** Production Ready
