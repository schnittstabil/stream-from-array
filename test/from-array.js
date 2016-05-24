import test from 'ava';
import streamRecorder from 'stream-recorder';

import fromArray from '../';

const stringResult = ['foo', 'bar'];

test.cb('should emit string results', t => {
	fromArray(stringResult)
	.pipe(streamRecorder(result => {
		t.deepEqual(result.toString(), stringResult.join(''));
	}))
	.on('error', () => t.fail())
	.on('end', () => t.end())
	.resume();
});

test.cb('with decodeStrings:false should emit string results', t => {
	fromArray(stringResult, {decodeStrings: false})
	.pipe(streamRecorder(result => {
		t.deepEqual(result.toString(), stringResult.join(''));
	}))
	.on('error', () => t.fail())
	.on('end', () => t.end())
	.resume();
});

test('should throw errors on non array', t => {
	const sut = fromArray(null);

	t.throws(sut.read.bind(sut), /null/);
});

test('constructor should return new instance w/o new', t => {
	const sut = fromArray([]);

	t.true(sut instanceof fromArray);
});
