import test from 'ava';
import recorder from 'stream-recorder';
import merge from 'merge-stream';
import File from 'vinyl';
import gulp from 'gulp';

import fromArray from '../';

const recorderOpts = {objectMode: true};
const testfilePath = '/test/file.coffee';
const testfile = new File({
	cwd: '/',
	base: '/test/',
	path: testfilePath,
	contents: new Buffer('answer: 42')
});

test.cb('in duplex mode should insert vinyl file in gulp stream', t => {
	const sut = fromArray.obj([testfile, testfile]);

	merge(gulp.src(__filename), sut)
	.pipe(recorder(recorderOpts, result => {
		const paths = result.map(file => file.path);

		t.deepEqual(paths.sort(), [testfilePath, testfilePath, __filename].sort());
	}))
	.on('error', () => t.fail())
	.on('end', () => t.end())
	.resume();
});
