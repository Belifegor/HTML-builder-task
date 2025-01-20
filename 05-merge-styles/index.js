const fs = require('fs').promises;
const path = require('path');

const stylesDirectory = path.join(__dirname, 'styles');
const outputDirectory = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDirectory, 'bundle.css');

async function mergeStyles() {
  await fs.writeFile(outputFile, 'bundle.css');

  const files = await fs.readdir(stylesDirectory, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(stylesDirectory, file.name);
      console.log(`CSS file found: ${filePath}`);

      const data = await fs.readFile(filePath, 'utf-8');
      await fs.appendFile(outputFile, data);
      console.log(`Data from ${filePath} appended to bundle.css`);
    }
  }
}

mergeStyles();