/* eslint-disable node/no-unsupported-features/es-syntax */
const fs = require('fs');
const readline = require('readline');
const csvParser = require('csv-parser');
const fastcsv = require('fast-csv');
const productRow = require('./constant/productRow');
const renameImageFile = require('./renameImageFile');

// Cvv File Example
// ID,Type,SKU,Name,Published,Is featured?,Visibility in catalog,Short description,Description,Date sale price starts,Date sale price ends,Tax status,Tax class,In stock?,Stock,Low stock amount,Backorders allowed?,Sold individually?,Weight (kg),Length (cm),Width (cm),Height (cm),Allow customer reviews?,Purchase note,Sale price,Regular price,Categories,Tags,Shipping class,Images,Download limit,Download expiry days,Parent,Grouped products,Upsells,Cross-sells,External URL,Button text,Position,Attribute 1 name,Attribute 1 value(s),Attribute 1 visible,Attribute 1 global

const createSkuWithAttribute = (csvFileName, option = {}) => {
  const imageBaseUrl = 'https://www.example.com/images';
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Step 1: Ask for the product name
  rl.question('Enter the product name📄:  ', (productName) => {
    const parentProductsku = productName.trim().replace(/\s/g, '-');

    // Step 2: Ask for the attributes
    rl.question('Enter the attributes (comma-separated)📏: ', (attributes) => {
      const attributeValues = attributes.split(',');
      const skus = attributeValues.map(
        (value) => `${parentProductsku}-${value.trim().replace(/\s/g, '-')}`
      );

      const rows = [];

      // Read the CSV file
      fs.createReadStream(csvFileName)
        .pipe(csvParser())
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', async () => {
          // Get Parent Image Information
          const imageData = await renameImageFile(
            productName,
            imageBaseUrl,
            skus
          );

          const { mainPath, variantPath } = imageData;
          // Convert the comma-separated attributes to an array
          const attributeImages = variantPath.split(',');
          // Add the parent product row
          const newParentRow = {
            ...productRow,
            // ID: rows.length + 1,
            Type: 'variable',
            SKU: parentProductsku,
            Name: productName,
            Parent: '',
            'Attribute 1 value(s)': '',
            Position: 0,
            Images: mainPath,
            ...option,
          };
          rows.push(newParentRow);

          // Add the skus rows
          skus.forEach((sku, index) => {
            const newRow = {
              ...productRow,
              // ID: rows.length + index + 1,
              Type: 'variation',
              SKU: sku,
              Name: `${productName} - ${attributeValues[index]}`,
              Parent: parentProductsku,
              'Attribute 1 value(s)': attributeValues[index],
              // here 2 is what user enter to show as first main product
              // Images: `${imageBaseUrl}/${productName}_${[index + 1 + Number(productCount)]}.jpg`,
              Position: index + 1,
              Images: attributeImages[index],
              ...option,
            };
            rows.push(newRow);
          });

          // Write the new CSV file
          const ws = fs.createWriteStream(csvFileName);
          fastcsv.write(rows, { headers: true }).pipe(ws);
          ws.on('finish', () => {
            console.log('CSV file has been updated!');
            rl.close();
          });
        });
    });
  });
};

module.exports = createSkuWithAttribute;
