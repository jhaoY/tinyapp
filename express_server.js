const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs')
const { generateRandomString, addUser, findUserByEmail, urlsForUser } = require('./helpers.js');
const { users, urlDatabase } = require('./data.js');

const app = express();
const PORT = 8080;

app.use(cookieSession({
  name: 'session',
  keys: ['one', 'two', 'three'],
  maxAge: 24 * 60 * 60 * 1000
}))
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


// Home page
app.get('/', (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls')
  } else {
    res.redirect('/login')
  }
});

// Register routes
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.params.id],
  };
  if(req.session.user_id) {
    res.redirect('/urls')
  } else {
    res.render('urls_register', templateVars);
  }
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const hashPass = bcrypt.hashSync(password, 10);
  if (email === '' || hashPass === '') {
    res.status(400);
    res.send('Empty email and/or password');
  } else if (findUserByEmail(email, users)) {
    res.status(400);
    res.send('User already exists');
  } else {
    const userID = addUser(email, hashPass);
    req.session.user_id = userID;
    res.redirect('/urls');
  }
});

// Login routes
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.params.id],
  };
  if(req.session.user_id) {
    res.redirect('/urls')
  } else {
    res.render('urls_login', templateVars);
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email, users);
  if (!user) {
    res.status(403);
    res.send('Email does not exist');
  } else if (!bcrypt.compareSync(password, user.password)) {
    res.status(403);
    res.send('Incorrect password');
  } else {
    const userID = user.id;
    req.session.user_id = userID;
    res.redirect('/urls');
  }
});

// Logout route
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

// URL related routes
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlsForUser(req.session.user_id),
    user: users[req.session.user_id],
  };
  if (!req.session.user_id) {
    res.send('ERROR: Cannot view URLs while signed out. Please login or register as a user.')
  } else {
    res.render('urls_index', templateVars);
  };
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    urls: urlsForUser(req.session.user_id),
    user: users[req.session.user_id]
  }
  if (!req.session.user_id){
    res.redirect('/login')
  } else {
    res.render('urls_new', templateVars);
  }
});

app.post('/urls', (req, res) => {
  if (!req.session.user_id) {
    res.send("Please log in to shorten URLS\n")
  } else {
    const id = generateRandomString();
    urlDatabase[id] = {
      longURL: req.body.longURL,
      userID: req.session.user_id
    };
    res.redirect(`/urls/${id}`);
  }
});

app.get('/urls/:id', (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(404);
    res.send('ERROR: URL not found')
  }
  const templateVars = { 
    user: [req.session.user_id],
    id: req.params.id, 
    longURL: urlDatabase[req.params.id].longURL 
  };
  if (!req.session.user_id) {
    res.send('ERROR: Cannot view URLs while signed out. Please login or register as a user.')
  } else if (urlDatabase[req.params.id].userID !== req.session.user_id) {
    res.send('ERROR: URL not accessible to unauthorized owners')
  } else {
    res.render('urls_show', templateVars);
  }
});

app.post('/urls/:id/update', (req, res) => {
  const id = req.params.id;
  if (!req.session.user_id) {
    res.send("Please log in to update URLS\n");
    return;
  } 
  urlDatabase[id].longURL = req.body.newLongURL;
  res.redirect('/urls');
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  if (!req.session.user_id) {
    res.send("Please log in to delete URLS\n");
    return;
  } 
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
  console.log(`TinyURL app listening on port ${PORT}`);
});
