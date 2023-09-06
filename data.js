const users = {
  userRandomID: {
    id: "randomID1",
    email: "test@test.com",
    password: "1234",
  },
  userRandomID2: {
    id: "randomID2",
    email: "test1@test.com",
    password: "password",
  },
};

// Function to add new user to users object

const addUser = (id, email, password) => {
  const newUser = {
    id,
    email,
    password
  }
users[newUser.generateRandomString()]
}

module.exports = { users }