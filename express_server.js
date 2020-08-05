const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080;

// express to use ejs as templating engine
app.set('view engine', 'ejs');

// convert request body from a Buffer into string and then add the data to req object under the key of 'body'
app.use(bodyParser.urlencoded({ extended: true }));

// Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(cookieParser());

// Log all requests to STDOUT
app.use(morgan('dev'));

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

// return a string of 6 random alphanumeric characters
function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
}

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('Hello World');
});

// respond with JSON string of urlDatabase
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  // console.log('Cookies', req.cookies); // {username: 'sam' }
  let templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  let templateVars = { username: req.cookies.username };
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username,
  };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  // req.params: {shortURL: <typedURL> }
  const longURL = urlDatabase[req.params.shortURL];

  res.redirect(longURL);
});

// Create a tiny URL by submitting a longURL, generate random shortURL and add it to database: from urls_new
app.post('/urls', (req, res) => {
  // console.log(req.body); // {longURL: 'http://www.apple.com'}
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;

  urlDatabase[shortURL] = longURL;

  res.redirect(`/urls/${shortURL}`);
});

// Update longURL in the database: from urls_show
app.post('/urls/:id', (req, res) => {
  // console.log('req.body', req.body);
  // console.log('req.params', req.params);
  const shortURL = req.params.id;
  const { updatedLongURL } = req.body;

  urlDatabase[shortURL] = updatedLongURL;

  res.send('Update OK');
});

// Delete URL from database: from urls_index
app.post('/urls/:shortURL/delete', (req, res) => {
  // console.log(req.body); // {}
  // console.log(req.params); // {shortURL: '<selectedShortURL>'}
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];

  res.send('Delete OK');
});

// Set a cookie submitted by the login form in the _header
app.post('/login', (req, res) => {
  console.log('req.body', req.body); // { username: 'username' }

  res.cookie('username', req.body.username);

  // how to check if i set the cookies?
  res.redirect('/urls');
});

// Log out and clear cookie: _header
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
