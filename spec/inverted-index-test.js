/* jslint node: true */
/* eslint linebreak-style: ["error", "windows"] */
'use strict';
let fs = require('fs');
let invertedIndex = require('../src/inverted-index.js');

const books = 'jasmine/books.json';
const pages = 'jasmine/pages.json';
const emptyFile = 'jasmine/inv-file.json';

/**
* Test suite for testing book.json data
*/
describe ('Read book data', () => {
  it ('should not be empty', () => {
    fs.readFile(books, 'utf8', (err, data) => {
      if (err) throw (err);
      const fileContent = data.replace(/\s+/g, '');
      expect (fileContent.length).toBeGreaterThan(0);
      done ();
    });
  });
});

/**
 * Populate index test suite
 */
describe ('Populate index', () => {
  beforeEach (() => {
    index = new invertedIndex.invertedIndex();
    index.createIndex(books);
    booksFileName = index.getFileName(books);
  });

  it('should create a new index when a file has been read', () => {
    expect(index.indexes).not.toBe({});
    expect(typeof index.indexes[booksFileName]).toBe("object");
    expect(index.indexes[booksFileName]).not.toBe({});
  });
});
