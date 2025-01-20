const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'secret-folder');

fs.readdir(filePath, (err, files) => {
  if (err) {
    console.log(err);
    return;
  }
  files.forEach((file) => {
    const fullPath = path.join(filePath, file);

    fs.stat(fullPath, (err, stats) => {
      if (err) {
        console.error(`Error getting stats for ${file}:`, err);
        return;
      }

      if (stats.isFile()) {
        const fileName = path.basename(file, path.extname(file));
        const fileExt = path.extname(file).slice(1);
        const fileSize = (stats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
      }
    });
  });
});
