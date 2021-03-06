/* jslint node: true */

var fs = require('fs');
var InvertedIndex = require('../src/inverted-index.js');

var books = 'jasmine/books.json';
var pages = 'jasmine/pages.json';
var emptyFile = 'jasmine/inv-file.json';


beforeAll(function(){
  index = new InvertedIndex();
  index.createIndex(pages);
  index.createIndex(books);
  booksFileName = index.getFileName(books);
});
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
  it('should create a new index when a file has been read', function () {
    expect(index.indexes).not.toBe({});
    expect(typeof index.indexes[booksFileName]).toBe('object');
    expect(index.indexes[booksFileName]).not.toBe({});
  });

  it('should map string keys to correct objects', function() {
    expect(index.indexes[booksFileName]['alice']).toEqual([0]);
    expect(index.indexes[booksFileName]['a']).toEqual([0,1]);
    expect(index.indexes[booksFileName]['an']).toEqual([1]);
  });

  it('Ensure previous index is not overwritten by a new json file', function(){
    index.createIndex(pages);
    pageFileName = index.getFileName(pages);
    expect(index.indexes[booksFileName]).not.toEqual(index.indexes[pages]);
  });
});

/**
 * Search Index test suite
 */
describe ('Search Index', function() {


  it('should return an array containing indices of the correct object', function() {
    expect(index.searchIndex('a')).toEqual([[0,1]]);
  });

  it('should handle an array of search terms', function() {
    expect(index.searchIndex(['a', 'an', ['alice', 'wonderland', ['hobbit', 'dwarf']]])).toEqual([[0, 1], [1], [0], [0], [1], [1]]);
  });

  it('should be able to handle a varied number of search terms', function(){
    expect(index.searchIndex('a an alice wonderland hobbit dwarf')).toEqual([[0, 1], [1], [0], [0], [1], [1]]);
  });
});
