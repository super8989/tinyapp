const { assert } = require('chai');

const { generateRandomString } = require('../helpers');

describe('generateRandomString', function () {
	it('should return a random string length of 6', function () {
		const randomStringLength = generateRandomString().length;
		const expectedOutput = 6;

		assert.deepEqual = (randomStringLength, expectedOutput);
	});

	it('random string 1 should not equal random string 2', function () {
		const randomString1 = generateRandomString();
		const randomString2 = generateRandomString();

		assert.notEqual(randomString1, randomString2);
	});
});
