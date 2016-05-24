# stream-from-array [![Dependencies Status Image](https://gemnasium.com/schnittstabil/stream-from-array.svg)](https://gemnasium.com/schnittstabil/stream-from-array) [![Build Status Image](https://travis-ci.org/schnittstabil/stream-from-array.svg)](https://travis-ci.org/schnittstabil/stream-from-array) [![Coverage Status](https://coveralls.io/repos/schnittstabil/stream-from-array/badge.png)](https://coveralls.io/r/schnittstabil/stream-from-array)

Create streams from arrays of arbitrary Javascript values like strings, functions, arrays, etc.

```bash
npm install stream-from-array --save
```


## Usage


### Stream of array of `String | Buffer`s

```JavaScript
import StreamFromArray from 'stream-from-array';

StreamFromArray(['some', ' ', 'strings'])
  .pipe(process.stdout); // output: some strings

StreamFromArray([new Buffer('some') , ' mixed ', new Buffer('strings')])
  .pipe(process.stdout); // output: some mixed strings
```


### Stream of (arbitrary) Javascript Values

```JavaScript
import StreamFromArray from 'stream-from-array';

let i = 0;

StreamFromArray.obj(['some', 42, 'mixed', 'array', () => {}])
  .on('data', data => {
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
import StreamFromArray from 'stream-from-array';
import File from 'vinyl';

const hello = new File({
      cwd: '/',
      base: '/hello/',
      path: '/hello/hello.js',
      contents: new Buffer('console.log("Hello");')
    });

const world = new File({
      cwd: '/',
      base: '/hello/',
      path: '/hello/world.js',
      contents: new Buffer('console.log("world!");')
    });

StreamFromArray.obj([hello, world])
  .pipe(someAwsomeGulpPlugin())
  .on('data', file => {
    console.log(file.contents.toString()); // dunno what someAwsomeGulpPlugin does :)
  });
```

See also [stream-recorder](https://github.com/schnittstabil/stream-recorder) for testing gulp plugins with stream-from-array.


## API


### Class: StreamFromArray

_StreamFromArrays_ are [Readable](http://nodejs.org/api/stream.html#stream_class_stream_readable_1) streams.


#### new StreamFromArray(array, [options])

* _array_ `Array` Array of arbitrary Javascript values like numbers, strings, objects, functions, ...
* _options_ `Object` passed through [new Readable([options])](http://nodejs.org/api/stream.html#stream_new_stream_readable_options)

Note: The `new` operator can be omitted.


#### StreamFromArray#obj(array, [options])

A convenience wrapper for `new StreamFromArray(array, {objectMode: true, ...})`.


## License

MIT © [Michael Mayer](http://schnittstabil.de)
