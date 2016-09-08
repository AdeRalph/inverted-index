const fs = require('fs');

module.exports = class InvertedIndex {
  constructor() {
    this.indexName = [];
    this.jsonData = {};
    this.indexFileContent = {};
    this.indexes = {};
    this.searchTerms = [];
    this.lastSearchedFile = '';
    this.searchResult = [];
  }

  /**
   * Create index
   *
   * CreateIndex takes in a string file path, indexes the file and stores it
   *
   * @param  {String} filePath path to the file
   * @return {void}
   */
  createIndex(filePath) {
    const fileName = this.getFileName(filePath);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    if (fileContent.replace(/\s+/g, '').length === 0) {
      throw new Error('file has no content');
    }

    try {
      if (this.isEmptyArray(fileContent)) {
        throw new Error('not a valid json array');
      }
    } catch(err) {
      throw new Error('not a valid json array');
    }

    this.indexFileContent[fileName] = fileContent;
    this.indexes[fileName] = this.parseFileContent(fileName);
  }

  /**
   * Get Index
   *
   * GetIndex takes in a string file name and  returns the index for that file
   *
   * @param  {String} term file name of for whose index is to be gotten
   * @return {Object | String} index object of the file or a message indicating
   * the no index exists
   */
  getIndex(filename) {
    const fileIndexName = this.getFileName(filename);

    if (!Object.hasOwnProperty.call(this.indexes, fileIndexName)) {
      return 'No index availabale for this file';
    }

    return this.indexes[fileIndexName];
  }

  /**
   * Search Index
   *
   * SearchIndex searhces the index for a term or terms
   *
   * @param  {String | Array} term Could either be a string or an array
   * of strings
   * @param  {String} [indexFileName] optional parameter indicating the index
   * to search
   * @return {Array | String} return an array of indexes for the terms or an
   * error message
   */
  searchIndex(term, indexFileName) {
    this.searchTerms = [];
    this.searchResult = [];

    this.flattenSearchTerm(term);

    if (Object.hasOwnProperty.call(this.indexes, indexFileName)) {
      this.setLastSearchedFile(indexFileName);
      this.populateSearchResult(indexFileName);
    } else {
      if (this.lastSearchedFile === '') {
        const indexNameLength = Object.keys(this.indexes).length;
        this.setLastSearchedFile(Object.keys(this.indexes)[indexNameLength - 1]);
      }
      this.populateSearchResult(this.lastSearchedFile);
    }
    return this.searchResult;
  }

  // helper functions
  /**
   * Get File Name
   *
   * Get the filename from a string representing the file path
   *
   * @param  {String} path file path
   * @return {String}      file name
   */
  getFileName(path) {
    const pathArray = path.split('/');
    return pathArray[pathArray.length - 1];
  }

  /**
   * Parse File Content
   *
   * Prepares the file content for index creation
   *
   * @param  {String} fileName
   * @return {Object}          index object for the file content
   */
  parseFileContent(fileName) {
    const objectCount = {};
    const fileContent = this.indexFileContent[fileName];
    const fileJson = JSON.parse(fileContent);
    let counter = 0;

    Object.keys(fileJson).forEach((key) => {
      if (!this.isEmptyObject(fileJson[key])) {
        const title = this.tokenize(fileJson[key].title);
        const text = this.tokenize(fileJson[key].text);
        const uniqueContent = this.uniqueValues(title.concat(text));

        objectCount[counter] = uniqueContent;
        counter++;
      }
    });

    return this.createFileIndex(objectCount);
  }

  /**
   * Create File Index
   *
   * Creates index from file content
   *
   * @param  {Array} term array of file object content
   * @return {Object}      index of file content
   */
  createFileIndex(term) {
    const termKeys = Object.keys(term);
    const index = {};

    termKeys.forEach((key) => {
      term[key].forEach((val) => {
        if (!Object.hasOwnProperty.call(index, val)) {
          index[val] = [];
        }

        index[val].push(parseInt(key, 10));
      });
    });

    return index;
  }

  /**
   * Tokenize
   *
   * Seperates a string into individual words
   *
   * @param  {String} terms
   * @return {Array}
   */
  tokenize(terms) {
    return this.sanitize(terms).split(/\s+/g);
  }

  /**
   * Sanitize
   *
   * Removes punctuations from a string
   *
   * @param  {String} term
   * @return {String}
   */
  sanitize(term) {
    return term.replace(/[.,:]/g, '').toLowerCase();
  }

  /**
   * Unique Values
   *
   * Removes duplicate words from the array
   *
   * @param  {Array} terms
   * @return {Array}
   */
  uniqueValues(terms) {
    return terms.filter((value, pos, array) => array.indexOf(value) === pos
    );
  }

  /**
   *  Flatten Search Term
   *
   * Takes a string or nested array and turns in into a flat array
   *
   * @param  {String | Array} terms could be a string or nestd array
   * @return {void}
   */
  flattenSearchTerm(terms) {
    if (Array.isArray(terms)) {
      terms.forEach((val) => {
        this.flattenSearchTerm(val);
      });
    } else if (terms.split(' ').length > 1) {
      const termArray = this.tokenize(terms);
      this.flattenSearchTerm(termArray);
    } else {
      terms = this.sanitize(terms);
      this.searchTerms.push(terms);
    }
  }

  /**
   * Populate Search Result
   *
   * Takes in the index name, searches the index for the search terms
   *
   * @param  {String} indexName
   * @return {void}
   */
  populateSearchResult(indexName) {
    this.searchTerms.forEach((val) => {
      if (Object.hasOwnProperty.call(this.indexes[indexName], val)) {
        this.searchResult.push(this.indexes[indexName][val]);
      } else {
        this.searchResult.push([]);
      }
    });
  }

  /**
   * Set Last Searched File
   *
   * Sets the last searched file/index
   *
   * @param {String} indexName
   * @return {void}
   */
  setLastSearchedFile(indexName) {
    this.lastSearchedFile = indexName;
  }

  isEmptyArray(content) {
    const parsedContent = JSON.parse(content);
    if (!Array.isArray(parsedContent) || parsedContent.length === 0) {
      return true;
    }

    return false;
  }

  isEmptyObject(content){
    if (content.toString !== {}.toString() || (Object.keys(content).length < 1)) {
      return true;
    }

    return false;
  }
};
