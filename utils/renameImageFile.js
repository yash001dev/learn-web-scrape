const fs = require('fs');
const path = require('path');
const readline = require('readline');

const renameImageFile = (newName, baseUrl = 'https://example.com') =>
  new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter the folder path: ', (folderPath) => {
      rl.close();

      const imageUrls = [];

      fs.readdir(folderPath, (err, files) => {
        if (err) {
          console.error('Error reading folder:', err);
          reject(err);
          return;
        }

        const jpgFiles = files.filter(
          (file) => path.extname(file).toLowerCase() === '.jpg'
        );

        const renamePromises = jpgFiles.map(
          (file, index) =>
            new Promise((resolve, reject) => {
              const originalFilePath = path.join(folderPath, file);
              const productName = file.replace('.jpg', '');

              if (productName) {
                const newFileName = `${newName.trim().replace(/\s/g, '_')}_${index + 1}.jpg`;
                const newFilePath = path.join(folderPath, newFileName);

                fs.rename(originalFilePath, newFilePath, (err) => {
                  if (err) {
                    console.error(
                      `Error renaming file ${originalFilePath} to ${newFilePath}:`,
                      err
                    );
                    reject(err);
                  } else {
                    console.log(
                      `File renamed successfully: ${originalFilePath} -> ${newFilePath}`
                    );
                    imageUrls.push(`${baseUrl}/${newFileName}`);
                    resolve();
                  }
                });
              }
            })
        );

        Promise.all(renamePromises)
          .then(() => {
            console.log('Image URLs:', imageUrls);
            resolve(imageUrls.join(', '));
          })
          .catch((err) => {
            console.error('Error renaming files:', err);
            reject(err);
          });
      });
    });
  });

module.exports = renameImageFile;
