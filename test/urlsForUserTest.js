const { assert } = require('chai');

const { urlsForUser } = require('../helpers');

const urlDatabase = {
  b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'aJ48lW' },
  i3BoGr: { longURL: 'https://www.google.ca', userID: 'aJ48lW' },
  t8PsLm: { longURL: 'https://www.apple.ca', userID: 'cP93zw' },
};

describe('urslForUser', function() {
  it('should return a filtered object of URLs created by the current user', function() {
    const filteredObj = urlsForUser(urlDatabase, 'aJ48lw');
    const expectedOutput = {
      b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'aJ48lW' },
      i3BoGr: { longURL: 'https://www.google.ca', userID: 'aJ48lW' },
    };

    assert.deepEqual = (filteredObj, expectedOutput);
  });

  it('should return an empty object if user has not created any URLs', function() {
    const filteredObj = urlsForUser(urlDatabase, 'nY60er');
    const expectedOutput = {};

    assert.deepEqual = (filteredObj, expectedOutput);
  });
});
