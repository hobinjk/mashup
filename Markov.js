/**
 * Tokenize text, building a 1 to n-ary markov word chain
 *
 * @constructor
 * @param {number} maxMarkovN
 * @param {String} text
 * @param {boolean} preserveNewlines
 */
function Markov(maxMarkovN, text, preserveNewlines) {
  this.maxMarkovN = maxMarkovN;
  this.preserveNewlines = preserveNewlines;

  var words = this.matchWords(text);

  this.wordGraphs = {};

  for (var markovN = 1; markovN <= this.maxMarkovN; markovN++) {
    var wordGraph = {};
    for (var i = 0; i < words.length; i++) {
      var graphKey = this.getKey(words, i, markovN);
      var outputWord = words[i];
      if (!wordGraph[graphKey] || !(wordGraph[graphKey] instanceof Array)) {
        wordGraph[graphKey] = [];
      }
      // Note that this preserves punctuation in an iffy way
      wordGraph[graphKey].push(outputWord);
    }
    this.wordGraphs[markovN] = wordGraph;
  }
}

/**
 * @param {Array<String>} words
 * @param {number} offset
 * @param {number} markovN
 * @return {String} graph key
 */
Markov.prototype.getKey = function(words, offset, markovN) {
  var graphKey = '';
  for (var n = -markovN; n < 0; n++) {
    var prevWord = '';
    if (offset + n >= 0) {
      prevWord = words[offset + n];
    }
    graphKey += this.normalize(prevWord);
    if (n < -1) {
      graphKey += ' '; // intersperse spaces
    }
  }
  return graphKey;
};

/**
 * @param {String} text
 * @return {Array<String>} raw words
 */
Markov.prototype.matchWords = function(text) {
  var re = /((\w+[-'’])?\w+[,.?!]*)/g;

  if (this.preserveNewlines) {
    // Add newline to terminal capture group
    re = /((\w+[-'’])?\w+[,.?!\n]*)/g;
  }

  return text.match(re) || [];
};

/**
 * @param {String} rawWord
 * @return {String} word without non-word characters
 */
Markov.prototype.normalize = function(rawWord) {
  return rawWord.replace(/\W/g, '').toLowerCase();
};

/**
 * @param {String} state - Previously generated text
 * @return {String?} Next generated token
 */
Markov.prototype.generate = function(state) {
  var words = this.matchWords(state);
  for (var markovN = this.maxMarkovN; markovN > 0; markovN--) {
    // Get key of last bit of text
    var key = this.getKey(words, words.length, markovN);
    var choices = this.wordGraphs[markovN][key];
    if (!choices) {
      continue;
    }
    return Util.randomChoice(choices);
  }
  return null;
};
