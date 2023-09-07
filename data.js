// User database
const user1 = {
  id: 'user1',
  email: 'test@test.com',
  password: '123'
}

const users = {
  user1: user1
};

// URL database
const urlDatabase = {
  'b2xVn2': {
    longURL: "http://www.lighthouselabs.ca",
    userID: 'user1'
  },
  '9sm5xK': {
    longURL: 'http://www.google.com',
    userID: 'user1'
  }
};

module.exports = { users, urlDatabase }