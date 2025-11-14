import * as readline from 'readline';
import ChannelManager from './utils/ChannelManager';
import { IChannel, ICountry, ICategory } from './types';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const channelManager = new ChannelManager();

function question(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

function displayChannels(channels: IChannel[]): void {
  if (channels.length === 0) {
    console.log('No channels found.\n');
    return;
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`Found ${channels.length} channel(s):`);
  console.log('='.repeat(80));

  channels.forEach((channel, index) => {
    console.log(`\n${index + 1}. ${channel.name}`);
    if (channel.id) {
      console.log(`   ID: ${channel.id}`);
    }
    if (channel.network) {
      console.log(`   Network: ${channel.network}`);
    }
    if (channel.alt_names && channel.alt_names.length > 0) {
      console.log(`   Alt Names: ${channel.alt_names.join(', ')}`);
    }
    if (channel.website) {
      console.log(`   Website: ${channel.website}`);
    }
    if (channel.categories && channel.categories.length > 0) {
      console.log(`   Categories: ${channel.categories.join(', ')}`);
    }
    if (channel.is_nsfw) {
      console.log(`   ⚠️  NSFW Content`);
    }
  });

  console.log(`\n${'='.repeat(80)}\n`);
}

async function selectByCountry(): Promise<void> {
  try {
    console.log('\n📍 Available countries...');
    const countries = channelManager.getCountries();

    console.log(`\nCountries (${countries.length}):`);
    countries.slice(0, 20).forEach((country, index) => {
      console.log(`  ${index + 1}. ${country.flag} ${country.name}`);
    });

    if (countries.length > 20) {
      console.log(`  ... and ${countries.length - 20} more`);
    }

    const countryInput = await question(
      '\nEnter country name (or part of it): '
    );

    const matchedCountries = countries.filter(c =>
      c.name.toLowerCase().includes(countryInput.toLowerCase())
    );

    if (matchedCountries.length === 0) {
      console.log('No countries found matching your input.');
      return;
    }

    let selectedCountry: ICountry | null = null;

    if (matchedCountries.length > 1) {
      console.log('\nMatched countries:');
      matchedCountries.forEach((country, index) => {
        console.log(`  ${index + 1}. ${country.flag} ${country.name}`);
      });
      const choice = await question('Select a country (number): ');
      selectedCountry = matchedCountries[parseInt(choice) - 1] || null;
      if (!selectedCountry) {
        console.log('Invalid selection.');
        return;
      }
    } else {
      selectedCountry = matchedCountries[0];
    }

    console.log(`\n📺 Fetching channels for ${selectedCountry.flag} ${selectedCountry.name}...`);
    const channels = channelManager.getChannelsByCountryCode(selectedCountry.code);
    displayChannels(channels);
  } catch (error) {
    console.error('Error selecting by country:', error);
  }
}

async function selectByCategory(): Promise<void> {
  try {
    console.log('\n🎬 Available categories...');
    const categories = channelManager.getCategories();

    console.log(`\nCategories (${categories.length}):`);
    categories.forEach((category, index) => {
      console.log(`  ${index + 1}. ${category.name} - ${category.description}`);
    });

    const categoryInput = await question(
      '\nEnter category name or number: '
    );

    let selectedCategory: ICategory | null = null;

    // Check if input is a number
    const categoryIndex = parseInt(categoryInput);
    if (!isNaN(categoryIndex) && categoryIndex > 0 && categoryIndex <= categories.length) {
      selectedCategory = categories[categoryIndex - 1];
    } else {
      // Otherwise, try to match by name
      const matchedCategories = categories.filter(c =>
        c.name.toLowerCase().includes(categoryInput.toLowerCase())
      );

      if (matchedCategories.length === 0) {
        console.log('No categories found matching your input.');
        return;
      }

      if (matchedCategories.length > 1) {
        console.log('\nMatched categories:');
        matchedCategories.forEach((category, index) => {
          console.log(`  ${index + 1}. ${category.name}`);
        });
        const choice = await question('Select a category (number): ');
        selectedCategory = matchedCategories[parseInt(choice) - 1] || null;
        if (!selectedCategory) {
          console.log('Invalid selection.');
          return;
        }
      } else {
        selectedCategory = matchedCategories[0];
      }
    }

    console.log(`\n📺 Fetching channels for category: ${selectedCategory.name}...`);
    const channels = channelManager.getChannelsByCategoryId(selectedCategory.id);
    displayChannels(channels);
  } catch (error) {
    console.error('Error selecting by category:', error);
  }
}

async function searchChannels(): Promise<void> {
  const query = await question('\n🔍 Enter search term: ');
  const results = channelManager.searchChannels(query);
  displayChannels(results);
}

async function showMainMenu(): Promise<void> {
  console.clear();
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                      🌍 WORLD TV APP 📺                      ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  console.log('Please select an option:');
  console.log('  1. Select channels by country');
  console.log('  2. Select channels by category');
  console.log('  3. Search channels');
  console.log('  4. Exit\n');

  const choice = await question('Enter your choice (1-4): ');

  switch (choice) {
    case '1':
      await selectByCountry();
      await continueMenu();
      break;
    case '2':
      await selectByCategory();
      await continueMenu();
      break;
    case '3':
      await searchChannels();
      await continueMenu();
      break;
    case '4':
      console.log('\nThank you for using World TV App. Goodbye! 👋');
      rl.close();
      process.exit(0);
      break;
    default:
      console.log('\nInvalid choice. Please try again.');
      await continueMenu();
  }
}

async function continueMenu(): Promise<void> {
  const response = await question('\nPress Enter to continue or type "exit" to quit: ');
  if (response.toLowerCase() === 'exit') {
    console.log('Thank you for using World TV App. Goodbye! 👋');
    rl.close();
    process.exit(0);
  }
  await showMainMenu();
}

async function main(): Promise<void> {
  try {
    console.log('Loading IPTV database...');
    await channelManager.loadData();
    console.log('');
    await showMainMenu();
  } catch (error) {
    console.error('Failed to start application:', error);
    rl.close();
    process.exit(1);
  }
}

main();
