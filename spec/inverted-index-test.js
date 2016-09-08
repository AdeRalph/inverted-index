/* jshint node: true */

var fs = require('fs');
var InvertedIndex = require('../src/inverted-index.js');

var books = 'jasmine/books.json';
var pages = 'jasmine/pages.json';
var inv_file = 'jasmine/inv-file.json';
var empty_array = 'jasmine/empty-array.json';
var index = new InvertedIndex();
index.createIndex(pages);
index.createIndex(books);
var booksFileName = index.getFileName(books);

/**
* Test suite for testing book.json data
*/
describe('Read book data', function () {
  it('should not be empty', function (done) {
    fs.readFile(books, 'utf8', function (err, data) {
      if (err) throw (err);
      var fileContent = data.replace(/\s+/g, '');
      expect (fileContent.length).toBeGreaterThan(0);
      done ();
    });
  });
});

/**
 * Create index test suite
 */
describe('Create Index', function(){
  it('should throw an error if the file is empty', function(){
    expect(function(){index.createIndex(inv_file)}).toThrowError('file has no content');
  });

  it('should have a valid JSON array', function(){
    // test for empty array
    expect(function(){index.createIndex(empty_array)}).toThrowError('not a valid json array');
  });
});

/**
 * Populate index test suite
 */
describe('Populate index', function () {
  it('should create a new index when a file has been read', function () {
    expect(index.indexes).not.toBe({});
    expect(typeof index.indexes[booksFileName]).toBe('object');
    expect(index.indexes[booksFileName]).not.toBe({});
  });

  it('should map string keys to correct objects', function() {
    expect(index.indexes[booksFileName].alice).toEqual([0]);
    expect(index.indexes[booksFileName].a).toEqual([0,1]);
    expect(index.indexes[booksFileName].an).toEqual([1]);
  });

  it('Ensure previous index is not overwritten by a new json file', function() {
    index.createIndex(pages);
    expect(index.indexes[booksFileName]).not.toEqual(index.indexes[pages]);
  });
});

/**
 * Search Index test suite
 */
describe('Search Index', function() {
  it('should return an empty array to an empty string or array', function(){
    expect(index.searchIndex([])).toEqual([]);
    expect(index.searchIndex(" ")).toEqual([]);
  });

  it('should throw an error on invalid parameter', function(){
    expect(function(){index.searchIndex({})}).toThrowError('Invalid search parameter');
    expect(function(){index.searchIndex("alice", {})}).toThrowError('Enter a valid filename');
    expect(function(){index.searchIndex("alice", [])}).toThrowError('Enter a valid filename');
  });

  it('should return an array containing indices of the correct object', function(){
    expect(index.searchIndex('a')).toEqual([[0,1]]);
  });

  it('should handle an array of search terms', function() {
    expect(index.searchIndex(['a', 'an', ['alice', 'wonderland', ['hobbit', 'dwarf']]])).toEqual([[0, 1], [1], [0], [0], [1], [1]]);
  });

  it('should be able to handle a varied number of search terms', function(){
    expect(index.searchIndex('a an alice wonderland hobbit dwarf')).toEqual([[0, 1], [1], [0], [0], [1], [1]]);
  });

  it('ask for valid filename if a non existent filename is entered' , function(){
    expect(index.searchIndex('random', 'random.txt')).toBe('enter a valid file name');
  });
});
