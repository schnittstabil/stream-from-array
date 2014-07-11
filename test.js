'use strict';
var fromArray = require('./'),
    merge = require('merge-stream'),
    assert = require('assert'),
    gulp = require('gulp'),
    recorder = require('stream-recorder'),
    File = require('vinyl'),
    testfilePath = '/test/file.coffee',
    testfile = new File({
      cwd: '/',
      base: '/test/',
      path: testfilePath,
      contents: new Buffer('answer: 42')
    });

describe('fromArray', function() {

  describe('with string as value', function() {
    var input = '\uD834\uDF06';

    it('should emit value', function(done) {
      fromArray(input)
      .on('error', done)
      .pipe(recorder(function(result) {
        assert.deepEqual(result.toString(), input);
        done();
      }))
      .resume();
    });

    describe('and decodeStrings:false option', function() {
      it('should emit value', function(done) {
        fromArray(input, {decodeStrings: false})
        .on('error', done)
        .pipe(recorder(function(result) {
          assert.deepEqual(result.toString(), input);
          done();
        }))
        .resume();
      });
    });
  });

  describe('with string array as value', function() {
    var input = ['foo', 'bar'];
    it('should emit value in object mode', function(done) {
      fromArray(input)
        .on('error', done)
        .pipe(recorder(function(result) {
          assert.deepEqual(result.toString(), input.join(''));
          done();
        }))
        .resume();
    });
  });

  it('should throw errors on non array', function() {
    var sut = fromArray(null);
    assert.throws(function() {
      sut.read();
    }, /null/);
  });

  it('constructor should return new instance w/o new', function() {
    var sut = fromArray;
    assert.strictEqual(sut() instanceof fromArray, true);
  });
});

describe('fromArray.obj', function() {

  [
    ['abc', null, 'def'],
    ['abc', undefined, 'def']
  ].forEach(function(input) {
    describe('with value == [..., ' + input[1] + ', ...]', function() {
      it('should end stream', function(done) {
        var opts = {objectMode: true};
        fromArray(input, opts)
          .on('error', done)
          .pipe(recorder(opts, function(result) {
            assert.deepEqual(result, ['abc']);
            done();
          }))
          .resume();
      });
    });
  });

  describe('with mixed object as value', function() {
    var input = ['foo', 1, { foobar: 'foobar', answer: 42 }, {}, 'bar'];

    it('should emit value', function(done) {
      var opts = {objectMode: true};
      fromArray.obj(input)
        .on('error', done)
        .pipe(recorder(opts, function(result) {
          assert.deepEqual(result, input);
          done();
        }))
        .resume();
    });
  });

  describe('in duplex mode', function() {
    it('should insert vinyl file in gulp stream', function(done) {
      var opts = {objectMode: true};
      var sut = new fromArray.obj([testfile, testfile]);
      merge(gulp.src(__filename), sut)
        .on('error', done)
        .pipe(recorder(opts, function(result) {
          var paths = result.map(function(file) { return file.path; });
          assert.deepEqual(paths, [testfilePath, testfilePath, __filename]);
          done();
        }))
        .resume();
    });
  });

  it('constructor should return new instance w/o new', function() {
    var sut = fromArray.obj,
        instance = sut();
    assert.strictEqual(instance instanceof fromArray, true);
  });
});
