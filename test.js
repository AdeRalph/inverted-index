var invert = require('./src/inverted-index.js');
var app = new  invert();

app.createIndex('jasmine/books.json');
console.log(app.searchIndex([]));
console.log(app.searchIndex(" "));
