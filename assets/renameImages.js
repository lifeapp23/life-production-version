const fs = require('fs');
const path = require('path');

// Specify the directory containing the images
const directoryPath = 'C:\\Users\\ahmed\\OneDrive\\Documentos\\health-backend-test-one\\assets\\images';

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.error('Unable to scan directory: ' + err);
  }

  files.forEach(file => {
    const oldPath = path.join(directoryPath, file);
    const newPath = path.join(directoryPath, file.replace(/__/g, '_'));

    // Rename the file only if the new name is different
    if (oldPath !== newPath) {
      fs.rename(oldPath, newPath, err => {
        if (err) {
          console.error('Error renaming file:', err);
        } else {
          //console.log(`Renamed: ${file} -> ${path.basename(newPath)}`);
        }
      });
    }
  });
});
