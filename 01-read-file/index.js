const fs = require('fs');
const path = require('node:path');

const fileReadStream = fs.createReadStream(
  path.resolve(__dirname, 'text.txt'),
  'utf-8',
);

fileReadStream.on('data', (content) => console.log(content));
