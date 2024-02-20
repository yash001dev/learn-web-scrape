const {
  createColumnHeader,
  renameImageFile,
  createSkuWithAttribute,
} = require('./utils/index');

// createColumnHeader();

// renameImageFile(
//     'iphone 13',
//     'https://www.example.com/images/'
// );
createSkuWithAttribute('./output.csv');
