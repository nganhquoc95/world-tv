const fs = require('fs');
const path = require('path');

// Cache for loaded data
let cachedData = null;

/**
 * Load all JSON data from public/data directory
 */
function loadData() {
  if (cachedData) {
    return cachedData;
  }

  try {
    const dataDir = path.join(process.cwd(), 'public', 'data');

    const channelsPath = path.join(dataDir, 'channels.json');
    const countriesPath = path.join(dataDir, 'countries.json');
    const categoriesPath = path.join(dataDir, 'categories.json');
    const feedsPath = path.join(dataDir, 'feeds.json');
    const streamsPath = path.join(dataDir, 'streams.json');

    cachedData = {
      channels: fs.existsSync(channelsPath) ? JSON.parse(fs.readFileSync(channelsPath, 'utf8')) : [],
      countries: fs.existsSync(countriesPath) ? JSON.parse(fs.readFileSync(countriesPath, 'utf8')) : [],
      categories: fs.existsSync(categoriesPath) ? JSON.parse(fs.readFileSync(categoriesPath, 'utf8')) : [],
      feeds: fs.existsSync(feedsPath) ? JSON.parse(fs.readFileSync(feedsPath, 'utf8')) : [],
      streams: fs.existsSync(streamsPath) ? JSON.parse(fs.readFileSync(streamsPath, 'utf8')) : []
    };

    return cachedData;
  } catch (error) {
    console.error('Error loading data:', error);
    // Return empty data structure on error
    return {
      channels: [],
      countries: [],
      categories: [],
      feeds: [],
      streams: []
    };
  }
}

module.exports = {
  loadData
};
