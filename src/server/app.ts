import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import ChannelManager from '../utils/ChannelManager';
import ParseChannels from '../utils/ParseChannels';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// Initialize channel manager
const channelManager = new ChannelManager();
const parseChannels = new ParseChannels();
let channels: any[] = [];
// API Routes

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'World TV API is running' });
});

/**
 * API Documentation endpoint
 * Returns comprehensive REST API specification
 */
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'World TV API',
    version: '2.0.0',
    description: 'REST API for browsing and streaming TV channels worldwide',
    baseUrl: `http://localhost:${PORT}`,
    documentation: 'Complete REST API documentation',
    endpoints: {
      health: {
        method: 'GET',
        path: '/api/health',
        description: 'Check if API is running',
        params: {},
        response: {
          status: 'ok',
          message: 'World TV API is running'
        }
      },
      countries: {
        method: 'GET',
        path: '/api/countries',
        description: 'Get list of all countries with channels',
        params: {},
        response: {
          success: true,
          count: 250,
          data: [
            {
              code: 'US',
              name: 'United States',
              languages: ['en'],
              flag: '🇺🇸'
            }
          ]
        }
      },
      categories: {
        method: 'GET',
        path: '/api/categories',
        description: 'Get list of all channel categories',
        params: {},
        response: {
          success: true,
          count: 30,
          data: [
            {
              id: 'news',
              name: 'News',
              description: 'News and current events'
            }
          ]
        }
      },
      channels: {
        method: 'GET',
        path: '/api/channels',
        description: 'Get paginated list of all channels',
        params: {
          page: { type: 'number', description: 'Page number (default: 1)', example: 1 },
          limit: { type: 'number', description: 'Results per page (default: 50)', example: 50 }
        },
        response: {
          success: true,
          pagination: {
            page: 1,
            limit: 50,
            total: 38025,
            pages: 761
          },
          count: 50,
          data: []
        }
      },
      channelById: {
        method: 'GET',
        path: '/api/channels/:id',
        description: 'Get specific channel details',
        params: {
          id: { type: 'string', description: 'Channel ID', example: 'abc123' }
        },
        response: {
          success: true,
          data: {
            id: 'abc123',
            name: 'Channel Name',
            country: 'US',
            categories: ['news'],
            is_nsfw: false
          }
        }
      },
      channelPlay: {
        method: 'GET',
        path: '/api/channels/:id/play',
        description: 'Get stream URL for a channel',
        params: {
          id: { type: 'string', description: 'Channel ID', example: 'abc123' }
        },
        response: {
          success: true,
          channelId: 'abc123',
          channelName: 'Channel Name',
          url: 'http://stream.example.com/channel.m3u8',
          logo: 'http://logo.example.com/channel.png',
          group: 'Group Title',
          countryCode: 'US',
          quality: '720p'
        }
      },
      channelFeeds: {
        method: 'GET',
        path: '/api/channels/:id/feeds',
        description: 'Get alternative feeds/streams for a channel',
        params: {
          id: { type: 'string', description: 'Channel ID', example: 'abc123' }
        },
        response: {
          success: true,
          channelId: 'abc123',
          count: 5,
          data: []
        }
      },
      channelsByCountry: {
        method: 'GET',
        path: '/api/channels/country/:code',
        description: 'Get channels by country code',
        params: {
          code: { type: 'string', description: 'Country code (e.g., US, GB)', example: 'US' },
          page: { type: 'number', description: 'Page number (default: 1)' },
          limit: { type: 'number', description: 'Results per page (default: 50)' }
        },
        response: {
          success: true,
          countryCode: 'US',
          pagination: {
            page: 1,
            limit: 50,
            total: 500,
            pages: 10
          },
          count: 50,
          data: []
        }
      },
      channelsByCountryName: {
        method: 'GET',
        path: '/api/channels/country-name',
        description: 'Get channels by country name',
        params: {
          name: { type: 'string', description: 'Country name (e.g., United States)', example: 'United States' },
          page: { type: 'number', description: 'Page number (default: 1)' },
          limit: { type: 'number', description: 'Results per page (default: 50)' }
        },
        response: {
          success: true,
          countryName: 'United States',
          countryCode: 'US',
          pagination: {
            page: 1,
            limit: 50,
            total: 500,
            pages: 10
          },
          count: 50,
          data: []
        }
      },
      channelsByCategory: {
        method: 'GET',
        path: '/api/channels/category/:id',
        description: 'Get channels by category',
        params: {
          id: { type: 'string', description: 'Category ID (e.g., news, sports)', example: 'news' },
          page: { type: 'number', description: 'Page number (default: 1)' },
          limit: { type: 'number', description: 'Results per page (default: 50)' }
        },
        response: {
          success: true,
          categoryId: 'news',
          categoryName: 'News',
          pagination: {
            page: 1,
            limit: 50,
            total: 1200,
            pages: 24
          },
          count: 50,
          data: []
        }
      },
      searchChannels: {
        method: 'GET',
        path: '/api/channels/search',
        description: 'Search channels by name or metadata',
        params: {
          q: { type: 'string', description: 'Search query', example: 'BBC' },
          page: { type: 'number', description: 'Page number (default: 1)' },
          limit: { type: 'number', description: 'Results per page (default: 50)' }
        },
        response: {
          success: true,
          query: 'BBC',
          pagination: {
            page: 1,
            limit: 50,
            total: 234,
            pages: 5
          },
          count: 50,
          data: []
        }
      },
      streams: {
        method: 'GET',
        path: '/api/streams',
        description: 'Get paginated list of all parsed stream channels',
        params: {
          page: { type: 'number', description: 'Page number (default: 1)', example: 1 },
          limit: { type: 'number', description: 'Results per page (default: 50)', example: 50 }
        },
        response: {
          success: true,
          pagination: {
            page: 1,
            limit: 50,
            total: 10000,
            pages: 200
          },
          count: 50,
          data: [
            {
              tvgId: 'uk.bbc.news',
              tvgLogo: 'http://logo.png',
              groupTitle: 'UK',
              name: 'BBC News',
              countryCode: 'GB',
              quality: '1080p',
              url: 'http://stream.example.com/bbc.m3u8'
            }
          ]
        }
      },
      searchStreams: {
        method: 'GET',
        path: '/api/streams/search',
        description: 'Search parsed streams by name or group',
        params: {
          q: { type: 'string', description: 'Search query', example: 'BBC' }
        },
        response: {
          success: true,
          query: 'BBC',
          count: 25,
          data: []
        }
      },
      playStream: {
        method: 'GET',
        path: '/api/play',
        description: 'Stream/proxy a channel (redirects to actual stream URL)',
        params: {
          url: { type: 'string', description: 'Stream URL', example: 'http://stream.example.com/channel.m3u8' },
          channelId: { type: 'string', description: 'Channel ID for validation (optional)', example: 'abc123' }
        },
        response: 'Redirects to stream URL (status 302)'
      }
    }
  });
});

/**
 * Get all countries
 */
app.get('/api/countries', (_req: Request, res: Response) => {
  try {
    const countries = channelManager.getCountries();
    res.json({
      success: true,
      count: countries.length,
      data: countries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch countries'
    });
  }
});

/**
 * Get all categories
 */
app.get('/api/categories', (_req: Request, res: Response) => {
  try {
    const categories = channelManager.getCategories();
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

/**
 * Get channels by country code
 * Query: ?code=US
 */
/**
 * Get channels by country code with pagination
 * Query: page=1, limit=50
 */
app.get('/api/channels/country/:code', (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const allChannels = channelManager.getChannelsByCountryCode(code);
    const total = allChannels.length;
    const data = allChannels.slice(skip, skip + limit);
    
    res.json({
      success: true,
      countryCode: code,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch channels'
    });
  }
});

/**
 * Get channels by country name
 * Query: ?name=United%20States
 */
app.get('/api/channels/country-name', (req: Request, res: Response): void => {
  try {
    const { name } = req.query;
    
    if (!name || typeof name !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Country name is required'
      });
      return;
    }

    const channels = channelManager.getChannelsByCountryName(name);
    const country = channelManager.getCountries().find(c =>
      c.name.toLowerCase() === name.toLowerCase()
    );
    
    res.json({
      success: true,
      countryName: name,
      countryCode: country?.code,
      count: channels.length,
      data: channels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch channels'
    });
  }
});

/**
 * Get channels by category ID with pagination
 * Query: page=1, limit=50
 */
app.get('/api/channels/category/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const allChannels = channelManager.getChannelsByCategoryId(id);
    const category = channelManager.getCategoryById(id);
    const total = allChannels.length;
    const data = allChannels.slice(skip, skip + limit);
    
    res.json({
      success: true,
      categoryId: id,
      categoryName: category?.name,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch channels'
    });
  }
});

/**
 * Search channels
 * Query: ?q=BBC
 */
/**
 * Search channels by name or metadata
 * Supports pagination with page and limit query parameters
 */
app.get('/api/channels/search', (req: Request, res: Response): void => {
  try {
    const { q, page: pageStr, limit: limitStr } = req.query;
    
    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
      return;
    }

    const page = parseInt(pageStr as string) || 1;
    const limit = parseInt(limitStr as string) || 50;
    const skip = (page - 1) * limit;

    const allResults = channelManager.searchChannels(q);
    const total = allResults.length;
    const data = allResults.slice(skip, skip + limit);

    res.json({
      success: true,
      query: q,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search channels'
    });
  }
});

/**
 * Get channel by ID
 */
app.get('/api/channels/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const channel = channelManager.getChannelById(id);
    
    if (!channel) {
      res.status(404).json({
        success: false,
        error: 'Channel not found'
      });
      return;
    }

    const feeds = channelManager.getFeedsByChannelId(id);
    
    res.json({
      success: true,
      data: {
        ...channel,
        feeds
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch channel'
    });
  }
});

/**
 * Get feeds for a channel
 */
app.get('/api/channels/:id/feeds', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const feeds = channelManager.getFeedsByChannelId(id);
    
    res.json({
      success: true,
      channelId: id,
      count: feeds.length,
      data: feeds
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feeds'
    });
  }
});

/**
 * Get all channels (paginated)
 * Query: ?page=1&limit=50
 */
app.get('/api/channels', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const allChannels = channelManager.getAllChannels();
    const total = allChannels.length;
    const data = allChannels.slice(skip, skip + limit);
    
    res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch channels'
    });
  }
});

/**
 * Get play URL for a channel
 * Query: ?name=BBC News or ?id=channelId
 */
app.get('/api/channels/:id/play', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    
    // Find channel in parsed streams
    const channel = channels.find(ch => ch.tvgId === id);
    
    if (!channel) {
      res.status(404).json({
        success: false,
        error: 'Channel not found in stream list'
      });
      return;
    }

    res.json({
      success: true,
      channelId: id,
      channelName: channel.name,
      url: channel.url,
      logo: channel.tvgLogo,
      group: channel.groupTitle,
      countryCode: channel.countryCode,
      quality: channel.quanlity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get play URL'
    });
  }
});

/**
 * Proxy stream endpoint - streams the video content
 * Usage: GET /api/play?url=<stream_url>&channelId=<id>
 */
app.get('/api/play', (req: Request, res: Response): void => {
  try {
    const { url, channelId } = req.query;

    if (!url || typeof url !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Stream URL is required'
      });
      return;
    }

    // Find channel for validation
    if (channelId && typeof channelId === 'string') {
      const channel = channels.find(ch => ch.tvgId === channelId);
      if (!channel) {
        res.status(404).json({
          success: false,
          error: 'Channel not found'
        });
        return;
      }
    }

    // Redirect to the actual stream URL
    res.redirect(url);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to play stream'
    });
  }
});

/**
 * Search channels from parsed streams
 * Query: ?q=BBC
 */
app.get('/api/streams/search', (req: Request, res: Response): void => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
      return;
    }

    const lowerQuery = q.toLowerCase();
    const results = channels.filter(ch =>
      ch.name.toLowerCase().includes(lowerQuery) ||
      ch.groupTitle.toLowerCase().includes(lowerQuery)
    );

    res.json({
      success: true,
      query: q,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search streams'
    });
  }
});

/**
 * Get all parsed channels from stream list
 */
app.get('/api/streams', (req: Request, res: Response): void => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const total = channels.length;
    const data = channels.slice(skip, skip + limit);

    res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch streams'
    });
  }
});


/**
 * Get all channels from SQLite database
 */
app.get('/api/db/channels', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const dbChannels = await parseChannels.getChannels(limit, offset);
    const total = await parseChannels.getChannelCount();

    res.json({
      success: true,
      source: 'sqlite',
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      count: dbChannels.length,
      data: dbChannels
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch channels from database',
      details: error.message
    });
  }
});

/**
 * Search channels in database
 */
app.get('/api/db/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
      return;
    }

    const results = await parseChannels.searchChannels(q);

    res.json({
      success: true,
      source: 'sqlite',
      query: q,
      count: results.length,
      data: results
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to search database',
      details: error.message
    });
  }
});

/**
 * Get channels by country from database
 */
app.get('/api/db/countries/:code', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const results = await parseChannels.getChannelsByCountry(code);

    res.json({
      success: true,
      source: 'sqlite',
      country: code,
      count: results.length,
      data: results
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch channels by country',
      details: error.message
    });
  }
});

/**
 * Get unique countries from database
 */
app.get('/api/db/countries', async (_req: Request, res: Response): Promise<void> => {
  try {
    const countries = await parseChannels.getCountries();

    res.json({
      success: true,
      source: 'sqlite',
      count: countries.length,
      data: countries
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch countries from database',
      details: error.message
    });
  }
});

/**
 * Get unique categories from database
 */
app.get('/api/db/categories', async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await parseChannels.getCategories();

    res.json({
      success: true,
      source: 'sqlite',
      count: categories.length,
      data: categories
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories from database',
      details: error.message
    });
  }
});

/**
 * Get channel by ID from database
 */
app.get('/api/db/channels/:tvgId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tvgId } = req.params;
    const channel = await parseChannels.getChannelById(tvgId);

    if (!channel) {
      res.status(404).json({
        success: false,
        error: 'Channel not found'
      });
      return;
    }

    res.json({
      success: true,
      source: 'sqlite',
      data: channel
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch channel from database',
      details: error.message
    });
  }
});

/**
 * API Test endpoint - tests all major endpoints
 * Returns status of all API functions
 */
app.get('/api/test', async (_req: Request, res: Response): Promise<void> => {
  try {
    const tests: { [key: string]: { status: string; message: string; data?: any; error?: string } } = {};

    // Test health
    tests.health = { status: 'ok', message: 'API is running' };

    // Test countries
    try {
      const countries = channelManager.getCountries();
      tests.countries = {
        status: 'ok',
        message: `Loaded ${countries.length} countries`,
        data: { count: countries.length, sample: countries[0] }
      };
    } catch (e: any) {
      tests.countries = { status: 'error', message: 'Failed to load countries', error: e.message };
    }

    // Test categories
    try {
      const categories = channelManager.getCategories();
      tests.categories = {
        status: 'ok',
        message: `Loaded ${categories.length} categories`,
        data: { count: categories.length, sample: categories[0] }
      };
    } catch (e: any) {
      tests.categories = { status: 'error', message: 'Failed to load categories', error: e.message };
    }

    // Test channels
    try {
      const allChannels = channelManager.getAllChannels();
      tests.channels = {
        status: 'ok',
        message: `Loaded ${allChannels.length} channels`,
        data: { count: allChannels.length, sample: allChannels[0] }
      };
    } catch (e: any) {
      tests.channels = { status: 'error', message: 'Failed to load channels', error: e.message };
    }

    // Test parsed streams
    try {
      tests.streams = {
        status: 'ok',
        message: `Loaded ${channels.length} parsed streams`,
        data: { count: channels.length, sample: channels[0] }
      };
    } catch (e: any) {
      tests.streams = { status: 'error', message: 'Failed to load streams', error: e.message };
    }

    // Test search
    try {
      const searchResults = channelManager.searchChannels('news');
      tests.search = {
        status: 'ok',
        message: `Search working - found ${searchResults.length} results for "news"`,
        data: { count: searchResults.length }
      };
    } catch (e: any) {
      tests.search = { status: 'error', message: 'Search failed', error: e.message };
    }

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      tests
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Test endpoint failed',
      details: error.message
    });
  }
});

// Serve index.html for all other routes (SPA support)
app.use((_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../public/dist/index.html'));
});

// Initialize and start server
async function startServer() {
  try {
    console.log('Loading IPTV database...');
    await channelManager.loadData();
    
    console.log('Loading M3U streams...');
    channels = await parseChannels.parse();
    
    app.listen(PORT, () => {
      console.log(`\n✅ World TV Web App is running!`);
      console.log(`🌐 Open your browser: http://localhost:${PORT}`);
      console.log(`📡 API Documentation: http://localhost:${PORT}/api\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
