const _ = require('lodash');
const productRow={
            //   ID: _.uniqueId(),
              Type: 'variation',
              SKU: _.uniqueId(),
              Name: _.uniqueId(),
              Published: '1',
              'Is featured?': '0',
              'Visibility in catalog': 'visible',
              'Short description': '',
              Description: '',
              'Date sale price starts': '',
              'Date sale price ends': '',
              'Tax status': 'taxable',
              'Tax class': '',
              'In stock?': '1',
              Stock: '100',
              'Low stock amount': '3',
              'Backorders allowed?': '0',
              'Sold individually?': '0',
              'Weight (kg)': '0',
              'Length (cm)': '0',
              'Width (cm)': '0',
              'Height (cm)': '0',
              'Allow customer reviews?': '1',
              'Purchase note': '',
              'Sale price': '',
              'Regular price': '',
              Categories: '',
              Tags: '',
              'Shipping class': '',
              Images: '',
              'Download limit': '',
              'Download expiry days': '',
              Parent: _.uniqueId(),
              'Grouped products': '',
              Upsells: '',
              'Cross-sells': '',
              'External URL': '',
              'Button text': '',
              Position: '',
              'Attribute 1 name': 'Color',
              'Attribute 1 value(s)': _.uniqueId(),
              'Attribute 1 visible': '1',
              'Attribute 1 global': '1',
}
module.exports = productRow;
