/* jslint node: true */
/* eslint linebreak-style: ["error", "windows"]*/
'use strict';
const fs = require('fs');

class invertedIndex {
  constructor() {
    this.indexName = [];
    this.jsonData = {};
    this.indexFileContent = {};
    this.indexes = {};
    this.searchTerms = [];
    this.lastSearchedFile = '';
    this.searchResult = [];
  }
}

module.exports = invertedIndex;
