const fs = require('fs');
const path = require('path');
const csvtojson = require('csvtojson');

/**
 * Script to convert CSV data to JSON for Vercel deployment
 */
async function generateJsonData() {
  console.log('🚀 Converting CSV data to JSON for Vercel deployment...');

  const dataDir = path.join(__dirname, '..', 'data');
  const outputDir = path.join(__dirname, '..', 'public', 'data');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    console.log('📄 Converting channels.csv to channels.json...');
    const channels = await convertChannels(path.join(dataDir, 'channels.csv'));
    fs.writeFileSync(path.join(outputDir, 'channels.json'), JSON.stringify(channels, null, 2));

    console.log('📄 Converting countries.csv to countries.json...');
    const countries = await convertCountries(path.join(dataDir, 'countries.csv'));
    fs.writeFileSync(path.join(outputDir, 'countries.json'), JSON.stringify(countries, null, 2));

    console.log('📄 Converting categories.csv to categories.json...');
    const categories = await convertCategories(path.join(dataDir, 'categories.csv'));
    fs.writeFileSync(path.join(outputDir, 'categories.json'), JSON.stringify(categories, null, 2));

    console.log('📄 Converting feeds.csv to feeds.json...');
    const feeds = await convertFeeds(path.join(dataDir, 'feeds.csv'));
    fs.writeFileSync(path.join(outputDir, 'feeds.json'), JSON.stringify(feeds, null, 2));

    console.log('✅ JSON data generation completed!');
    console.log(`📁 JSON files saved to: ${outputDir}`);

  } catch (error) {
    console.error('❌ Error generating JSON data:', error);
    process.exit(1);
  }
}

/**
 * Parse semicolon-separated values from CSV
 */
function parseArray(value) {
  if (!value || value.trim() === '') return [];
  return value.split(';').filter(item => item.trim() !== '');
}

/**
 * Convert channels CSV to JSON
 */
async function convertChannels(filePath) {
  const data = await csvtojson().fromFile(filePath);
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    alt_names: parseArray(row.alt_names),
    network: row.network || undefined,
    owners: parseArray(row.owners),
    country: row.country,
    categories: parseArray(row.categories),
    is_nsfw: row.is_nsfw === 'TRUE',
    launched: row.launched || undefined,
    closed: row.closed || undefined,
    replaced_by: row.replaced_by || undefined,
    website: row.website || undefined
  }));
}

/**
 * Convert countries CSV to JSON
 */
async function convertCountries(filePath) {
  const data = await csvtojson().fromFile(filePath);
  return data.map((row) => ({
    code: row.code,
    name: row.name,
    languages: parseArray(row.languages),
    flag: row.flag
  }));
}

/**
 * Convert categories CSV to JSON
 */
async function convertCategories(filePath) {
  const data = await csvtojson().fromFile(filePath);
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description
  }));
}

/**
 * Convert feeds CSV to JSON
 */
async function convertFeeds(filePath) {
  const data = await csvtojson().fromFile(filePath);
  return data.map((row) => ({
    channel: row.channel,
    id: row.id,
    name: row.name,
    alt_names: parseArray(row.alt_names),
    is_main: row.is_main === 'TRUE',
    broadcast_area: parseArray(row.broadcast_area),
    timezones: parseArray(row.timezones),
    languages: parseArray(row.languages),
    format: row.format || undefined
  }));
}

// Run the script
generateJsonData();
