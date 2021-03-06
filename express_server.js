const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');

const { checkEmail, urlsForUser, generateRandomString } = require('./helpers');

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

app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);

// Custom CSS
app.use(express.static(__dirname + '/public'));

// Example of using bcrypt for passwords
// const password = 'purple-monkey-dinosaur'; // found in the req.params object
// const hashedPassword = bcrypt.hashSync(password, 10);

const urlDatabase = {
  b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'aJ48lW' }, // user = super8989@gmail.com
  i3BoGr: { longURL: 'https://www.google.ca', userID: 'aJ48lW' },
  t8PsLm: { longURL: 'https://www.apple.ca', userID: 'cP93zw' }, // user = sam@gmail.com
};

const users = {
  aJ48lW: { id: 'aJ48lW', email: 'super8989@gmail.com', password: 'a' },
  cP93zw: { id: 'cP93zw', email: 'sam@gmail.com', password: 'a' },
  gR27io: { id: 'gR27io', email: 'greg@gmail.com', password: 'a' },
};

// GET

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('Hello World');
});

// respond with JSON string of urlDatabase
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls.users', (req, res) => {
  res.json(users);
});

app.get('/urls', (req, res) => {
  // console.log('Cookies', req.cookies); // {username: 'sam' }
  console.log('Cookies', req.session.user_id);

  const currentUser = req.session.user_id; // randomID
  const userUrls = urlsForUser(urlDatabase, currentUser);
  const templateVars = { urls: userUrls, user: users[currentUser] };

  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const currentUser = req.session.user_id; // randomID
  const templateVars = { user: users[currentUser], emptyURL: false };

  if (currentUser) {
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
});

app.get('/urls/:shortURL', (req, res) => {
  const currentUser = req.session.user_id; // randomID

  for (shortURL in urlDatabase) {
    if (shortURL === req.params.shortURL) {
      const templateVars = {
        urlDatabase,
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL].longURL,
        user: users[currentUser],
      };

      res.render('urls_show', templateVars);
      return;
    }
  }

  // *****RENDER A 404 PAGE HERE*****
  res.render('urls_404');

  // const templateVars = {
  // 	urlDatabase,
  // 	shortURL: req.params.shortURL,
  // 	longURL: urlDatabase[req.params.shortURL].longURL,
  // 	user: users[currentUser],
  // };

  // res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  // req.params: {shortURL: <typedURL> }
  const longURL = urlDatabase[req.params.shortURL].longURL;

  res.redirect(longURL);
});

app.get('/register', (req, res) => {
  const currentUser = req.session.user_id; // randomID
  const templateVars = {
    user: users[currentUser],
    emptyForms: false,
    userRegistered: false,
  };

  res.render('urls_register', templateVars);
});

app.get('/login', (req, res) => {
  const currentUser = req.session.user_id; // randomID
  const templateVars = {
    user: users[currentUser],
    emptyForms: false,
    userNotFound: false,
    wrongPassword: false,
  };

  res.render('urls_login', templateVars);
});

// POST

// Create a tiny URL by submitting a longURL, generate random shortURL and add it to database: from urls_new
app.post('/urls', (req, res) => {
  // console.log(req.body); // {longURL: 'http://www.apple.com'}
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;

  if (!longURL) {
    // res.status(403).send('Submit a longURL');
    const currentUser = req.session.user_id;
    const templateVars = {
      user: users[currentUser],
      emptyURL: true,
    };
    res.render('urls_new', templateVars);
  } else {
    urlDatabase[shortURL] = {
      longURL,
      userID: req.session.user_id,
    };

    res.redirect(`/urls/${shortURL}`);
  }
});

// Update longURL in the database: from urls_show
app.post('/urls/:id', (req, res) => {
  // console.log('req.body', req.body);
  // console.log('req.params', req.params);
  const currentUser = req.session.user_id;
  const shortURL = req.params.id;
  const { updatedLongURL } = req.body;

  if (urlDatabase[shortURL].userID === currentUser) {
    urlDatabase[shortURL].longURL = updatedLongURL;
  } else {
    res
      .status(403)
      .send('Unable to update this tiny URL. You do not have permission.');
    return;
  }

  res.redirect('/urls');
});

// Delete URL from database: from urls_index
app.post('/urls/:shortURL/delete', (req, res) => {
  // console.log(req.body); // {}
  // console.log(req.params); // {shortURL: '<selectedShortURL>'}
  const shortURL = req.params.shortURL;
  const currentUser = req.session.user_id;

  if (urlDatabase[shortURL].userID === currentUser) {
    delete urlDatabase[shortURL];
  } else {
    res
      .status(403)
      .send('Unable to delete this tiny URL. You do not have permission.');
    return;
  }

  res.redirect('/urls');
});

// Set a cookie submitted by the login form in the urls_login
app.post('/login', (req, res) => {
  console.log('req.body', req.body); // { email: <email>, password: <password> }
  const submittedEmail = req.body.email;
  const submittedPassword = req.body.password;

  if (req.body.email === '' || req.body.password === '') {
    // res.status(403).send('Email and password must be submitted');
    // return;
    const currentUser = req.session.user_id; // randomID
    const templateVars = {
      user: users[currentUser],
      emptyForms: true,
      userNotFound: false,
      wrongPassword: false,
    };
    res.render('urls_login', templateVars);
  }

  if (!checkEmail(users, submittedEmail)) {
    // res.status(403).send('Email not found');
    // return;
    const currentUser = req.session.user_id; // randomID
    const templateVars = {
      user: users[currentUser],
      emptyForms: false,
      userNotFound: true,
      wrongPassword: false,
    };
    res.render('urls_login', templateVars);
  }

  if (checkEmail(users, submittedEmail)) {
    const foundUser = checkEmail(users, submittedEmail);

    // if (foundUser.password === submittedPassword) {
    if (bcrypt.compareSync(submittedPassword, foundUser.password)) {
      // res.cookie('user_id', foundUser.id);
      req.session.user_id = foundUser.id;
      res.redirect('/urls');
    } else {
      // res.status(403).send('Incorrect password');
      // return;
      const currentUser = req.session.user_id; // randomID
      const templateVars = {
        user: users[currentUser],
        emptyForms: false,
        userNotFound: false,
        wrongPassword: true,
      };
      res.render('urls_login', templateVars);
    }
  }
});

// Log out and clear cookie: _header
app.post('/logout', (req, res) => {
  // res.clearCookie('user_id');
  req.session = null;
  res.redirect('/urls');
});

// Create a new user from: urls_register
app.post('/register', (req, res) => {
  // console.log(req.body); // {email: '...com', password: '...'}
  if (req.body.email === '' || req.body.password === '') {
    // res.status(400).send('Email and password must be submitted');
    const currentUser = req.session.user_id; // randomID
    const templateVars = {
      user: users[currentUser],
      emptyForms: true,
      userRegistered: false,
    };

    res.render('urls_register', templateVars);
  } else if (checkEmail(users, req.body.email)) {
    // res.status(400).send('Email already registered');
    const currentUser = req.session.user_id; // randomID
    const templateVars = {
      user: users[currentUser],
      emptyForms: false,
      userRegistered: true,
    };

    res.render('urls_register', templateVars);
  } else {
    const randomID = generateRandomString();

    users[randomID] = {
      id: randomID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    };

    console.log(users);

    // res.cookie('user_id', randomID);
    req.session.user_id = randomID;
    res.redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
