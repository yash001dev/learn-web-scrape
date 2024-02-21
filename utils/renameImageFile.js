const fs = require('fs');
const path = require('path');
const readline = require('readline');

const renameImageFiles = (
  newName,
  paths,
  baseUrl = 'https://example.com',
  skus
) =>
  new Promise((resolve, reject) => {
    const results = {};

    const pathPromises = Object.entries(paths)?.map(
      ([key, folderPath]) =>
        new Promise((resolve, reject) => {
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
                    const newFileName = `${newName.trim().replace(/\s/g, '_')}_${key === 'variantPath' ? skus[index] ?? index + 1 : index + 1}.jpg`;
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
                resolve({ folderPath, imageUrls: imageUrls.join(', '), key });
              })
              .catch((err) => {
                console.error('Error renaming files:', err);
                reject(err);
              });
          });
        })
    );

    Promise.all(pathPromises)
      .then((pathResults) => {
        pathResults.forEach(({ folderPath, imageUrls, key }) => {
          results[key] = imageUrls;
        });
        resolve(results);
      })
      .catch((err) => {
        console.error('Error processing paths:', err);
        reject(err);
      });
  });

const renameImageFile = (newName, baseUrl = 'https://example.com', skus) =>
  new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter the folder path: ', (folderPath) => {
      rl.close();

      const folderPaths = {
        mainPath: folderPath,
        variantPath: `${folderPath}/variants/`,
      };

      const imageUrls = [];

      renameImageFiles(newName, folderPaths, baseUrl, skus)
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          console.error('Error:', err);
          reject(err);
        });

      // fs.readdir(folderPath, (err, files) => {
      //   if (err) {
      //     console.error('Error reading folder:', err);
      //     reject(err);
      //     return;
      //   }

      //   const jpgFiles = files.filter(
      //     (file) => path.extname(file).toLowerCase() === '.jpg'
      //   );

      //   const renamePromises = jpgFiles.map(
      //     (file, index) =>
      //       new Promise((resolve, reject) => {
      //         const originalFilePath = path.join(folderPath, file);
      //         const productName = file.replace('.jpg', '');

      //         if (productName) {
      //           const newFileName = `${newName.trim().replace(/\s/g, '_')}_${index + 1}.jpg`;
      //           const newFilePath = path.join(folderPath, newFileName);

      //           fs.rename(originalFilePath, newFilePath, (err) => {
      //             if (err) {
      //               console.error(
      //                 `Error renaming file ${originalFilePath} to ${newFilePath}:`,
      //                 err
      //               );
      //               reject(err);
      //             } else {
      //               console.log(
      //                 `File renamed successfully: ${originalFilePath} -> ${newFilePath}`
      //               );
      //               imageUrls.push(`${baseUrl}/${newFileName}`);
      //               resolve();
      //             }
      //           });
      //         }
      //       })
      //   );

      //   Promise.all(renamePromises)
      //     .then(() => {
      //       console.log('Image URLs:', imageUrls);
      //       resolve(imageUrls.join(', '));
      //     })
      //     .catch((err) => {
      //       console.error('Error renaming files:', err);
      //       reject(err);
      //     });
      // });
    });
  });

module.exports = renameImageFile;
