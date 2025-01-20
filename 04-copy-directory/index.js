const fs = require('fs').promises;
const path = require('path');

const directoryName = path.join(__dirname, 'files');
const destinationDirectory = path.join(__dirname, 'files-copy');

async function clearDirectory(directory) {
  try {
    await fs.rm(directory, { recursive: true, force: true });
    console.log(`Cleared directory: ${directory}`);
  } catch (err) {
    console.error(`Error clearing directory: ${directory}`, err);
  }
}

async function copyDir() {
  await fs.mkdir(destinationDirectory, { recursive: true });
  let files;
  try {
    files = await fs.readdir(directoryName);

    for (const file of files) {
      const sourcePath = path.join(directoryName, file);
      const destPath = path.join(destinationDirectory, file);

      const stats = await fs.stat(sourcePath);
      if (stats.isFile()) {
        await fs.copyFile(sourcePath, destPath);
        console.log(`${file} copied successfully.`);
      }
    }
  } catch (err) {
    console.error('Error reading or copying files:', err);
  }
}

async function syncDirectories() {
  await clearDirectory(destinationDirectory);

  await copyDir();
}

syncDirectories()
  .then(() => console.log('Directories synchronized successfully!'))
  .catch((err) => console.error('Error synchronizing directories:', err));
