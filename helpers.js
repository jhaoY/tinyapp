const { urlDatabase } = require('./data');

// Function to generate a random string for shortURL ID
const generateRandomString = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to add new user to users object
const addUser = (email, password) => {
  const newUser = {
    id: generateRandomString(),
    email,
    password
  };
  users[newUser.id] = newUser;
  console.log('New user added', newUser)

  return newUser.id;
}

// Check if user exists
const findUserByEmail = (email, database) => {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return null;
}

// Returns URL where userID is equal to currently logged in user
const urlsForUser = (id) => {
  let userURLs = {};
  for (let url in urlDatabase) {
    if (id === urlDatabase[url].userID) {
      userURLs[url] = {
        longURL: urlDatabase[url].longURL
      }
    }
  }
  return userURLs;
};

module.exports = {
  generateRandomString,
  addUser,
  findUserByEmail,
  urlsForUser
};