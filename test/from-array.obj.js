import test from 'ava';
import recorder from 'stream-recorder';

import fromArray from '../';

const recorderOpts = {objectMode: true};
const mixedArray = ['foo', 1, {foobar: 'foobar', answer: 42}, {}, 'bar'];

test.cb('with value == [..., null, ...] should end stream', t => {
	fromArray.obj(['abc', null, 'def'])
	.pipe(recorder(recorderOpts, result => {
		t.deepEqual(result, ['abc']);
	}))
	.on('error', () => t.fail())
	.on('end', () => t.end())
	.resume();
});

test.cb('with mixed object as value should emit value', t => {
	fromArray.obj(mixedArray)
	.pipe(recorder(recorderOpts, result => {
		t.deepEqual(result, mixedArray);
	}))
	.on('error', () => t.fail())
	.on('end', () => t.end())
	.resume();
});

test.cb('should end with empty array', t => {
	fromArray.obj([])
	.on('data', () => t.fail())
	.on('error', () => t.fail())
	.on('end', () => t.end())
	.resume();
});

test('should throw errors on non array', t => {
	const sut = fromArray.obj(null);

	t.throws(sut.read.bind(sut), /null/);
});

test('constructor should return new instance w/o new', t => {
	const sut = fromArray.obj([]);

	t.true(sut instanceof fromArray);
});
