#!/usr/bin/env ts-node

import ParseChannels from '../src/utils/ParseChannels';

/**
 * Script to parse M3U channels and store them in SQLite database
 * Usage: npm run generate-channels
 */
async function main() {
    console.log('🚀 Starting channel parsing and storage to SQLite...');

    try {
        const parseChannels = new ParseChannels();

        console.log('📄 Parsing M3U file...');
        const channels = await parseChannels.parse();

        console.log(`✅ Successfully parsed and stored ${channels.length} channels in SQLite database`);

        // Close database connection
        parseChannels.closeDatabase();

        console.log('🎉 Channel parsing completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error parsing channels:', error);
        process.exit(1);
    }
}

// Run the script
main();