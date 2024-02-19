const fs = require('fs');

const csvData = [
  ['ID', 'Type', 'SKU', 'Name', 'Published', 'Is featured?', 'Visibility in catalog', 'Short description', 'Description', 'Date sale price starts', 'Date sale price ends', 'Tax status', 'Tax class', 'In stock?', 'Stock', 'Low stock amount', 'Backorders allowed?', 'Sold individually?', 'Weight (kg)', 'Length (cm)', 'Width (cm)', 'Height (cm)', 'Allow customer reviews?', 'Purchase note', 'Sale price', 'Regular price', 'Categories', 'Tags', 'Shipping class', 'Images', 'Download limit', 'Download expiry days', 'Parent', 'Grouped products', 'Upsells', 'Cross-sells', 'External URL', 'Button text', 'Position', 'Attribute 1 name', 'Attribute 1 value(s)', 'Attribute 1 visible', 'Attribute 1 global'],
  // Add your data rows here
];

// Data to be written to the CSV file
const createColumnHeader=(csvColumn=csvData)=>{
    // Create CSV file
    const csvFileName = 'output.csv';
    const csvContent = csvData.map(row => row.join(',')).join('\n');

    fs.writeFile(csvFileName, csvContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing CSV file:', err);
        } else {
            console.log(`CSV file '${csvFileName}' created successfully.`);
        }
    })
}

module.exports = createColumnHeader;