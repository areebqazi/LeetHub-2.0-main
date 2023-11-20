const path = require('path');
const fs = require('fs');

const entryPoints = {};

// Get all JavaScript files in the folder
const folderPath = './old_scripts'; // Replace with your folder path
const files = fs.readdirSync(folderPath);

// Generate entry points for each JavaScript file
files.forEach((file) => {
  if (file.endsWith('.js')) {
    const fileName = path.parse(file).name;
    const filePath = folderPath + '/' + file;
    entryPoints[fileName] = filePath;
  }
});
module.exports = {
  entry: './old_scripts/leetcode_new.js',
  output: {
    filename: 'leetcode_new.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
