const fs = require('fs');
const readline = require('readline');
const csv = require('csv-parser');
const fastcsv = require('fast-csv');

const createSkuWithAttribute = (csvFileName) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the product name: ', (productName) => {
    const parentProductsku = productName.trim().replace(/\s/g, '-');

    rl.question('Enter the attributes (comma-separated): ', (attributes) => {
      const attributeValues = attributes.split(',');
      const skus = attributeValues.map((value) => `${parentProductsku}-${value.trim().replace(/\s/g, '-')}`);

      console.log('SKUs:', skus);

      const rows = [];
      
      fs.createReadStream(csvFileName)
        .pipe(csv())
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => {
          const header = rows[0];
          const skuIndex = header.findIndex((column) => column.toLowerCase() === 'sku');
          
          // Update the SKUs in each row
          rows.slice(1).forEach((row, index) => {
            row[skuIndex] = skus[index];
          });

          // Write to a new CSV file
          const newCsvFileName = `updated_${csvFileName}`;
          const ws = fs.createWriteStream(newCsvFileName);
          
          fastcsv.write([header, ...rows.slice(1)], { headers: true })
            .pipe(ws)
            .on('finish', () => {
              console.log('SKUs written to the new CSV file:', newCsvFileName);
              rl.close();
            });
        })
        .on('error', (err) => {
          console.error('Error reading CSV file:', err.message ?? err);
          rl.close();
        });
    });
  });
};

module.exports = createSkuWithAttribute;
