/*jslint node: true */
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

export default { invertedIndex };
