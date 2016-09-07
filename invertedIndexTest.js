var InvertedIndex = require('./src/inverted-index.js');

var books = "jasmine/inv-file.json";

var index = new InvertedIndex();

index.createIndex(books);
// console.log(index.getIndex(books));
console.log(index.searchIndex({}));
