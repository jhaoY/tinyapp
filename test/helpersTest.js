const { assert } = require('chai');
const { findUserByEmail } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('findUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = findUserByEmail('user@example.com', testUsers);
    const expectedUserID = 'userRandomID'
    assert.strictEqual(user.id, expectedUserID);
  })
  it('should return null if no user exists', () => {
    const user = findUserByEmail('nonExistentUser@example.com', testUsers);
    assert.strictEqual(null, user);
  })
})