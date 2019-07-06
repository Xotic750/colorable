/*

USAGE:
 - run: node dev-tools/LintTools/maxAttributesPerLine.js
 - run: ./node_modules/.bin/eslint --ext .js,.vue . --fix

*/

const fs = require('fs');
const path = require('path');
const getFiles = require('../Utils/getFiles');

const APP_ROOT = path.join(__dirname, '../../');
const styleContent = /<style[^>]*>[\s\S]+<\/style>/;

function processFile(file) {
  console.log('Processing:', file);

  const fileContent = fs.readFileSync(file, 'utf8');
  const styleString = fileContent.match(styleContent);

  if (!styleString) {
    return;
  }

  const styleBlock = styleString[0];

  // console.log(styleBlock);

  // console.log('::: SOURCE :::');
  // console.log(source);

  // console.log('::: JSCODESHIFT :::');
  // console.log(transformed);

  const newContent = `${fileContent.replace(styleBlock, '').trim()}\n\n${styleBlock.trim()}\n`;

  fs.writeFileSync(file, newContent);
  // fs.writeFileSync(__dirname + '/test.vue', newContent);
}

getFiles(APP_ROOT, '.vue')
  .then((files) => {
    const sourceFiles = files.filter((filePath) => !filePath.includes('node_modules') && !filePath.includes('sandbox'));
    console.log('Found', sourceFiles.length);
    sourceFiles.forEach(processFile);

    return sourceFiles;
  })
  .catch((err) => console.log(err));
