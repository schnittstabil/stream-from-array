'use strict';
var Readable = require('stream').Readable,
    inherits = require('util').inherits;

function StreamFromArray(array, options) {
  if (!(this instanceof StreamFromArray)) {
    return new StreamFromArray(array, options);
  }

  Readable.call(this, options);

  this.__array = array;
  this.__index = 0;
}
inherits(StreamFromArray, Readable);

StreamFromArray.obj = function(array, options) {
  options = options || {};
  options.objectMode = true;
  return new StreamFromArray(array, options);
};

StreamFromArray.prototype._read = function() {
  var needMoreData,
      value;
  while (this.__index < this.__array.length && needMoreData !== false) {
    value = this.__array[this.__index++];
    needMoreData = this.push(value);
    if (typeof value === 'undefined' || value === null) {
      // value signaled end of data
      this.__index = this.__array.length;
    } else if (this.__index === this.__array.length) {
      // end of data
      this.push(null);
    }
  }
};

module.exports = StreamFromArray;
