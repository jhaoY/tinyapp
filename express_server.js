const express = require('express');
const cookieParser = require('cookie-parser')
const { generateRandomString, addUser, findUserByEmail } = require('./helpers.js')
const { users } = require('./data.js')

const app = express();
const PORT = 8080;

app.use(cookieParser())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies['user_id']]
  };
  res.render('urls_index', templateVars);
});

app.get('/register', (req, res) => {
  res.render('urls_register')
})

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(400);
    res.send('Invalid email and/or password')
  } else if (findUserByEmail(email)) {
    res.status(400);
    res.send('User already exists')
  }
  const userID = addUser(email, password);
  res.cookie('user_id', userID)
  console.log(users);
  res.redirect('/urls')
})

app.get('/login', (req, res) => {
  res.render('urls_login')
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls/:id', (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render('urls_show', templateVars);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post('/urls', (req, res) => {
  console.log(req.body);
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL
  res.redirect(`urls/${id}`)
})

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id]
  console.log(urlDatabase);
  res.redirect(`/urls`)
})

app.post('/urls/:id', (req, res) => {
  res.redirect(`/urls/${req.params.id}`)
})

app.post('/urls/:id/update', (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.newLongURL
  res.redirect('/urls')
})

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  if (!user) {
    res.status(403)
    res.send("Email does not exist")
  } else if (user.password !== password) {
    res.status(403)
    res.send("Incorrect password")
  } else {
    const userID = user.id
    res.cookie('user_id', userID)
    res.redirect('/urls');
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

app.get('/u/:id', (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

