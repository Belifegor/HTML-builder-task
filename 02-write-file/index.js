const fs = require('fs');
const { stdin, stdout } = process;
const path = require('path');

const filePath = path.join(__dirname, 'text-2.txt');

const output = fs.createWriteStream(filePath, { flags: 'a' });

stdout.write('Please enter your text (type "exit" ot "ctrl + C" to quit):\n');
stdin.on('data', (data) => {
  const text = data.toString().trim();

  if (text.toLowerCase() === 'exit') {
    stdout.write('Goodbye!\n');
    process.exit()
  }

  output.write(`${text}\n`);
  stdout.write('Text has been added. You can continue typing:\n');
});

process.on('SIGINT', () => {
  stdout.write('Goodbye!\n');
  process.exit();
});