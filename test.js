var invert = require('./src/inverted-index.js');
var app = new  invert();

app.createIndex('jasmine/empty-array.json');
app.getIndex('empty-array.json');
// console.log(Object.keys(JSON.parse("{}")));

// console.log(app.searchIndex(" "));
//
// var empty = JSON.parse('[{"we":8}]');
//
// console.log(empty.length);
// console.log(Object.keys(empty[0]));
// console.log({w:2}.toString());
//
// console.log(JSON.parse("sgdbf"));
