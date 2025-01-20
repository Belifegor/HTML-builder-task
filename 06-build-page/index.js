const fs = require('fs').promises;
const path = require('path');

const stylesDirectory = path.join(__dirname, 'styles');
const outputDirectory = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDirectory, 'style.css');
const assetsSource = path.join(__dirname, 'assets');
const assetsDestination = path.join(outputDirectory, 'assets');
const templatePath = path.join(__dirname, 'template.html');
const componentsDirectory = path.join(__dirname, 'components');
const outputHTML = path.join(outputDirectory, 'index.html');

async function createProjectDist() {
  try {
    await fs.mkdir(outputDirectory, { recursive: true });
    console.log('Folder project-dist created or already exists');
  } catch (err) {
    console.error('Error creating project-dist folder:', err);
  }
}

async function mergeStyles() {
  await fs.writeFile(outputFile, '');

  const files = await fs.readdir(stylesDirectory, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(stylesDirectory, file.name);
      console.log(`CSS file found: ${filePath}`);

      const data = await fs.readFile(filePath, 'utf-8');
      await fs.appendFile(outputFile, data);
      console.log(`Data from ${filePath} appended to style.css`);
    }
  }
}

async function copyAssets(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const items = await fs.readdir(src, { withFileTypes: true });

    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isDirectory()) {
        await copyAssets(srcPath, destPath);
      } else if (item.isFile()) {
        await fs.copyFile(srcPath, destPath);
        console.log(`File copied: ${srcPath} -> ${destPath}`);
      }
    }
  } catch (err) {
    console.error('Error copying assets:', err);
  }
}

async function buildHTML() {
  try {
    let templateContent = await fs.readFile(templatePath, 'utf-8');

    const tagRegex = /{{\w+}}/g;
    const tags = templateContent.match(tagRegex);

    if (tags) {
      for (const tag of tags) {
        const componentName = tag.slice(2, -2);
        const componentPath = path.join(
          componentsDirectory,
          `${componentName}.html`,
        );

        try {
          const componentContent = await fs.readFile(componentPath, 'utf-8');
          templateContent = templateContent.replace(tag, componentContent);
        } catch (err) {
          console.error(`Error reading component file for tag ${tag}:`, err);
        }
      }
    }

    await fs.writeFile(outputHTML, templateContent);
    console.log('index.html has been created successfully!');
  } catch (err) {
    console.error('Error building HTML:', err);
  }
}

createProjectDist();
mergeStyles();
copyAssets(assetsSource, assetsDestination);
buildHTML();
