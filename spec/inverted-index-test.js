/* jslint node: true */
/* eslint linebreak-style: ["error", "windows"] */
// 'use strict';

var fs = require('fs');
var InvertedIndex = require('../src/inverted-index.js');

var books = 'jasmine/books.json';
var pages = 'jasmine/pages.json';
var emptyFile = 'jasmine/inv-file.json';

/**
* Test suite for testing book.json data
*/
describe ('Read book data', function () {
  it ('should not be empty', function () {
    fs.readFile(books, 'utf8', function (err, data) {
      if (err) throw (err);
      var fileContent = data.replace(/\s+/g, '');
      expect (fileContent.length).toBeGreaterThan(0);
      done ();
    });
  });
});

/**
 * Populate index test suite
 */
describe ('Populate index', function () {
  beforeEach (function () {
    index = new InvertedIndex();
    index.createIndex(books);
    booksFileName = index.getFileName(books);
  });

  it('should create a new index when a file has been read', function () {
    expect(index.indexes).not.toBe({});
    expect(typeof index.indexes[booksFileName]).toBe("object");
    expect(index.indexes[booksFileName]).not.toBe({});
  });

  it('should map string keys to correct objects', function() {
    expect(index.indexes[booksFilename]["alice"]).toEqual([0]);
    expect(index.indexes[booksFileName]["a"]).toEqual([0,1]);
    expect(index.indexes[booksFileName]["an"]).toEqual([1]);
  });
});
