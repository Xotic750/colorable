/*

USAGE:
 - run: node dev-tools/LintTools/maxAttributesPerLine.js
 - run: ./node_modules/.bin/eslint --ext .js,.vue . --fix

*/

const fs = require('fs');
const path = require('path');
const getFiles = require('../Utils/getFiles');

const APP_ROOT = path.join(__dirname, '../../');
const templateContent = /<template>[\s\S]+<\/template>/;
const multipleAttributeCheck = /(?!=\/)<\w+(\s)+[^\s]|(?!=\/)"(\s)+[^\s]/g;
const attributeSeparator = /(?!=\/)<\w+(\s)+|(?!=\/)"(\s)+/g;

function processFile(file) {
  console.log('Processing:', file);
  const fileContent = fs.readFileSync(file, 'utf8');
  const template = fileContent.match(templateContent)[0].slice('<template>'.length, -'</template>'.length);
  const templateLines = template.split(/\n/);

  const addedLineBreaks = templateLines
    .map((line) => {
      const foundAttributes = line.match(multipleAttributeCheck);

      if (!foundAttributes || foundAttributes.length === 1) {
        return line;
      }

      return line.replace(attributeSeparator, (match) => match.split(' ').join('\n'));
    })
    .join('\n');

  const newContent = fileContent.replace(templateContent, `<template>${addedLineBreaks}</template>`);

  fs.writeFileSync(file, newContent);
}

getFiles(APP_ROOT, '.vue')
  .then((files) => {
    const vueFiles = files.filter((filePath) => !filePath.includes('node_modules') && !filePath.includes('sandbox'));
    console.log(vueFiles);
    vueFiles.forEach(processFile);

    return vueFiles;
  })
  .catch((err) => console.log(err));
