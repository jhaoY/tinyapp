const express = require('express');
const cookieParser = require('cookie-parser');
const { generateRandomString, addUser, findUserByEmail, urlsForUser } = require('./helpers.js');
const { users, urlDatabase } = require('./data.js');

const app = express();
const PORT = 8080;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


// Home page
app.get('/', (req, res) => {
  res.send('Hello');
});

// Register routes
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.params.id],
  };
  if(req.cookies.user_id) {
    res.redirect('/urls')
  } else {
    res.render('urls_register', templateVars);
  }
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (email === '' || password === '') {
    res.status(400);
    res.send('Invalid email and/or password');
  } else if (findUserByEmail(email)) {
    res.status(400);
    res.send('User already exists');
  } else {
    const userID = addUser(email, password);
    res.cookie('user_id', userID);
    console.log(users);
    res.redirect('/urls');
  }
});

// Login routes
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.params.id],
  };
  if(req.cookies.user_id) {
    res.redirect('/urls')
  } else {
    res.render('urls_login', templateVars);
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  if (!user) {
    res.status(403);
    res.send('Email does not exist');
  } else if (user.password !== password) {
    res.status(403);
    res.send('Incorrect password');
  } else {
    const userID = user.id;
    res.cookie('user_id', userID);
    res.redirect('/urls');
  }
});

// Logout route
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

// URL related routes
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlsForUser(req.cookies.user_id),
    user: users[req.cookies.user_id],
  };
  if (!req.cookies.user_id) {
    res.send('ERROR: Cannot view URLs while signed out. Please login or register as a user.')
  } else {
    res.render('urls_index', templateVars);
  };
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  }
  if (!req.cookies.user_id){
    res.redirect('/login')
  } else {
    res.render('urls_new', templateVars);
  }
});

app.post('/urls', (req, res) => {
  if (!req.cookies.user_id) {
    res.send("Please log in to shorten URLS\n")
  } else {
    const id = generateRandomString();
    urlDatabase[id] = {
      longURL: req.body.longURL,
      userID: req.cookies.user_id
    };
    res.redirect(`/urls/${id}`);
  }
});

app.get('/urls/:id', (req, res) => {
  const templateVars = { 
    user: [req.cookies.user_id],
    id: req.params.id, 
    longURL: urlDatabase[req.params.id].longURL 
  };
  if (!req.cookies.user_id) {
    res.send('ERROR: Cannot view URLs while signed out. Please login or register as a user.')
  } else if (urlDatabase[req.params.id].userID !== req.cookies.user_id) {
    res.send('ERROR: URL not accessible to unauthorized owners')
  } else {
    res.render('urls_show', templateVars);
  }
});

app.post('/urls/:id/update', (req, res) => {
  const id = req.params.id;
  urlDatabase[id].longURL = req.body.newLongURL;
  res.redirect('/urls');
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  console.log(urlDatabase);
  res.redirect('/urls');
});

// Redirect short URLs to their corresponding long URLs
app.get('/u/:id', (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if(!longURL) {
    res.status(404);
    res.send('Whoops, that doesn\'t exist!')
  } else {
    res.redirect(longURL);
  }
});

// JSON endpoint for URL database
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
