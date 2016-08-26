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
    const fileName = this.getFileName(filePath);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    if (fileContent.replace(/\s+/g, '').length === 0) {
      throw new Error('file has no content');
    }

    if (this.indexName.indexOf(fileName) < 0) {
      this.indexName.push(fileName);
    }

    this.indexFileContent[fileName] = fileContent;
    this.indexes[fileName] = this.parseFileContent(fileName);
  }

  getIndex(term) {
    const filename = term;
    const fileIndexName = this.getFileName(filename);

    if (this.indexName.indexOf(fileIndexName) < 0) {
      return 'No index availabale for this file';
    }

    return this.indexes[fileIndexName];
  }

  // helper functions
  getFileName(path) {
    const pathArray = path.split('/');
    const arrayLength = pathArray.length;
    return pathArray[arrayLength - 1];
  }

  parseFileContent(fileName) {
    let fileIndex = {};
    const objectCount = {};
    const fileContent = this.indexFileContent[fileName];
    const fileJson = JSON.parse(fileContent);
    let counter = 0;

    for (let arrayPos of fileJson) {
      const title = this.tokenize(arrayPos.title);
      const text = this.tokenize(arrayPos.text);
      const allContent = title.concat(text);
      const uniqueContent = this.uniqueValues(allContent);

      objectCount[counter] = {};
      objectCount[counter] = uniqueContent;
      counter++;
    }

    fileIndex = this.createFileIndex(objectCount);

    return fileIndex;
  }

  createFileIndex(term) {
    const termKeys = Object.keys(term);
    const keyLength = termKeys.length;
    const index = {};

    for (let i = 0; i < keyLength; i++) {
      term[i].forEach((val) => {
        if (!Object.hasOwnProperty.call(index, val)) {
          index[val] = [];
        }

        index[val].push(i);
      });
    }

    return index;
  }

  tokenize(terms) {
    const termWithoutPunct = this.sanitize(terms);
    const termArray = termWithoutPunct.split(/\s+/g);
    return termArray;
  }

  sanitize(term) {
    return term.replace(/[.,:]/g, '').toLowerCase();
  }

  uniqueValues(terms) {
    return terms.filter((value, pos, array) => array.indexOf(value) === pos
    );
  }
};
