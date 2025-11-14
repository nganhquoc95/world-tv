// Test script to verify country names are displaying correctly
// Run this in browser console

console.log('Testing country filter functionality...');

// Check if countryNames object is populated
setTimeout(() => {
    console.log('Country Names Map:', Object.keys(countryNames).slice(0, 10));
    console.log('Sample countries:', 
        countryNames['gb'], // Should be "United Kingdom"
        countryNames['us'], // Should be "United States" 
        countryNames['ua']  // Should be "Ukraine"
    );
    
    // Check dropdown options
    const select = document.getElementById('countrySelect');
    console.log('Country select options (first 5):');
    Array.from(select.options).slice(0, 5).forEach(opt => {
        console.log(`  ${opt.value}: ${opt.textContent}`);
    });
}, 2000);
