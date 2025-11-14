import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import ChannelManager from '../utils/ChannelManager';
import ChannelModel from './ChannelModel';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// Initialize channel manager
const channelManager = new ChannelManager();
const channelModel = new ChannelModel();
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
        description: 'Get paginated list of all parsed stream channels from SQLite database',
        params: {
          page: { type: 'number', description: 'Page number (default: 1)', example: 1 },
          limit: { type: 'number', description: 'Results per page (default: 50)', example: 50 },
          country: { type: 'string', description: 'Filter by country code (e.g., US, GB)', example: 'US' },
          category: { type: 'string', description: 'Filter by category (e.g., news, sports)', example: 'news' }
        },
        response: {
          success: true,
          source: 'sqlite',
          filters: {
            country: 'US',
            category: 'news'
          },
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
              categories: ['news'],
              url: 'http://stream.example.com/bbc.m3u8'
            }
          ]
        }
      },
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
 * Get all parsed channels from SQLite database with filtering
 * Query: ?page=1&limit=50&country=US&category=news
 */
app.get('/api/streams', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const country = req.query.country as string;
    const category = req.query.category as string;
    const offset = (page - 1) * limit;

    const result = await channelModel.getChannels({
      limit,
      offset,
      country,
      category
    });

    res.json({
      success: true,
      source: 'sqlite',
      filters: {
        country: country || null,
        category: category || null
      },
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit)
      },
      count: result.channels.length,
      data: result.channels
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch streams from database',
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

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  try {
    channelModel.close();
    console.log('✅ Database connections closed');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  try {
    channelModel.close();
    console.log('✅ Database connections closed');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
  process.exit(0);
});

startServer();

export default app;
