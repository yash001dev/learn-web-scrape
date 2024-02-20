const fs = require('fs');
const path = require('path');
const readline = require('readline');

const renameImageFile = (newName, baseUrl) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the folder path: ', (folderPath) => {
    rl.close();

    // Array to store the image URLs
    const imageUrls = [];

    // Read files in the specified folder
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading folder:', err);
        return;
      }

      // Filter JPG files
      const jpgFiles = files.filter(
        (file) => path.extname(file).toLowerCase() === '.jpg'
      );

      // Create an array of promises for the rename operations
      const renamePromises = jpgFiles.map(
        (file, index) =>
          new Promise((resolve, reject) => {
            const originalFilePath = path.join(folderPath, file);

            // Extract product name from the file name (modify as needed based on your naming convention)
            const productName = file.replace('.jpg', ''); // Assumes the product name is the file name without extension

            // Ensure the product name is not empty
            if (productName) {
              // Use newName parameter to rename the file
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

                  // Add the new image URL to the array
                  imageUrls.push(`${baseUrl}/${newFileName}`);
                  resolve();
                }
              });
            }
          })
      );

      // Wait for all rename operations to complete
      Promise.all(renamePromises)
        .then(() => {
          // Log the image URLs
          console.log('Image URLs:', imageUrls);
        })
        .catch((err) => {
          console.error('Error renaming files:', err);
        });
    });
  });
};

module.exports = renameImageFile;
