const {
  createColumnHeader,
  renameImageFile,
  createSkuWithAttribute,
} = require('./utils/index');

// createColumnHeader();

// renameImageFile('iphone 13', 'https://www.example.com/images/').then((data) => {
//   console.log('URLLL:', data);
// });
createSkuWithAttribute('./output.csv');
