/*jslint node: true */
'use strict';
const fs = require('fs');
let invertedIndex = require('../src/inverted-index.js');

const books = 'jasmine/books.json';
const pages = 'jasmine/pages.json';
const emptyFile = 'jasmine/inv-file.json';

/**
* Test suite for testing book.json data
*/
describe('Read book data', () => {
  it('should not be empty', () => {
    fs.readFile(books, 'utf8', (err, data) => {
      if (err) throw (err);
      const fileContent = data.replace(/\s+/g, '');
      expect(fileContent.length).toBeGreaterThan(0);
      done();
    });
  });
});
