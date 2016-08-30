# Inverted-index
The inverted index is a structure used to perform the elasticsearch on a document to allow for fast searches. It contains the list of all unique words that appear on a document.


- - -
## Installation and running the test
- Clone the repository using the command `git clone git@github.com:AdeRalph/inverted-index.git`
- Run `npm install` to install the necessary dependencies
- Run the command `jasmine` to run the jasmine tests

## Inverted Index functions
###createIndex(filePath)
Takes a file's path and creates an index from the contents of the file
###getIndex(fileName)
Takes the file name and returns the index of the file
###searchIndex(searchTerm, [fileName])
Returns an array of object indices for the search terms, the fileName parameter is optional and specifies the index to search from
