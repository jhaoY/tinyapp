const { users } = require('./data');

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
  const newUserID = generateRandomString();
  users[newUserID] = newUser;
  console.log('New user added', newUser)

  return newUserID;
}

module.exports = {
  generateRandomString,
  addUser
};