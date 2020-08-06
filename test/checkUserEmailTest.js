const { assert } = require('chai');

const { checkEmail } = require('../helpers');

const testUsers = {
	userRandomID: {
		id: 'userRandomID',
		email: 'user@example.com',
		password: 'purple-monkey-dinosaur',
	},
	user2RandomID: {
		id: 'user2RandomID',
		email: 'user2@example.com',
		password: 'dishwasher-funk',
	},
};

describe('checkEmail', function () {
	it('should return a user object with registered email', function () {
		const user = checkEmail(testUsers, 'user@example.com');
		const expectedOutput = testUsers.userRandomID;

		assert.deepEqual(user, expectedOutput);
	});

	it('should return false for unregistered email', function () {
		const user = checkEmail(testUsers, 'invalid@example.com');
		const expectedOutput = false;

		assert.equal(user, expectedOutput);
	});
});
