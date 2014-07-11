# stream-from-array [![Dependencies Status Image](https://gemnasium.com/schnittstabil/stream-from-array.svg)](https://gemnasium.com/schnittstabil/stream-from-array) [![Build Status Image](https://travis-ci.org/schnittstabil/stream-from-array.svg)](https://travis-ci.org/schnittstabil/stream-from-array) [![Coverage Status](https://coveralls.io/repos/schnittstabil/stream-from-array/badge.png)](https://coveralls.io/r/schnittstabil/stream-from-array)

Create streams from arrays of arbitrary Javascript values like strings, functions, arrays, etc.

```bash
npm install stream-from-array --save
```

## Usage

### Stream of array of `String | Buffer`s

```JavaScript
var StreamFromArray = require('stream-from-array');

StreamFromArray(['some', ' ', 'strings'])
  .pipe(process.stdout); // output: some strings

StreamFromArray([new Buffer('some') , ' mixed ', new Buffer('strings')])
  .pipe(process.stdout); // output: some mixed strings
```

### Stream of (arbitrary) Javascript Values

```JavaScript
var StreamFromArray = require('stream-from-array');

var i = 0;
StreamFromArray.obj(['some', 42, 'mixed', 'array', function(){}])
  .on('data', function(data){
    console.log(i++ + ': ' + typeof data);
    /* outputs:
      0: string
      1: number
      2: string
      3: string
      4: function
    */
  });
```

### Stream of [Gulp](http://gulpjs.com/) Files

Gulp files are [vinyl](https://github.com/wearefractal/vinyl) files:

```bash
npm install vinyl
```

Test some awsome Gulp plugin:

```JavaScript
var StreamFromArray = require('stream-from-array'),
    File = require('vinyl');

var hello = new File({
      cwd: '/',
      base: '/hello/',
      path: '/hello/hello.js',
      contents: new Buffer('console.log("Hello");')
    });

var world = new File({
      cwd: '/',
      base: '/hello/',
      path: '/hello/world.js',
      contents: new Buffer('console.log("world!");')
    });

StreamFromArray.obj([hello, world])
  .pipe(someAwsomeGulpPlugin())
  .on('data', function(file){
    console.log(file.contents.toString()); // dunno what someAwsomeGulpPlugin does :)
  });
```

See also [stream-recorder](https://github.com/schnittstabil/stream-recorder) for testing gulp plugins with stream-from-array.

## API

### Class: StreamFromArray

StreamFromArrays are [Readable](http://nodejs.org/api/stream.html#stream_class_stream_readable_1) streams.

#### new StreamFromArray(array, [options])

* _array_ `Array` Array of arbitrary Javascript values like numbers, strings, objects, functions, ...
* _options_ `Object` passed through [new Readable([options])](http://nodejs.org/api/stream.html#stream_new_stream_readable_options)

Note: The `new` operator can be omitted.

#### StreamFromArray#obj(array, [options])

A convenience wrapper for `new StreamFromArray(array, {objectMode: true, ...})`.

## License

Copyright (c) 2014 Michael Mayer

Licensed under the MIT license.
