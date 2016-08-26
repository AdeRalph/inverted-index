/* jslint node: true */
/* eslint linebreak-style: ["error", "windows"]*/
'use strict';
const fs = require('fs');

module.exports = class InvertedIndex {
  constructor() {
    this.indexName = [];
    this.jsonData = {};
    this.indexFileContent = {};
    this.indexes = {};
    this.searchTerms = [];
    this.lastSearchedFile = '';
    this.searchResult = [];
  }

  createIndex(filePath) {
    const fileName = getFileName(filePath);
    let fileContent = fs.readFileSynce(filePath, 'utf8');

    if (fileContent.replae(/\s+/g, '').length === 0) {
      throw new Error('file has no content');
    }

    if (this.indexName.indexOf(fileName) < 0) {
      this.indexName.push(fileName);
    }

    this.indexFileContent[fileName] = fileContent;
    this.indexes[fileName] = parseFileContent(fileName);
  }
}
