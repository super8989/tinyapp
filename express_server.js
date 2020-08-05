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

const users = {}; // { a17s4a: { id: 'a17s4a', email: 'sam@gmail.com', password: 'test' }, {...} }

// return a string of 6 random alphanumeric characters
function generateRandomString() {
	return Math.random().toString(36).substr(2, 6);
}

// Check if submitted email is in the user database
const checkEmail = (userDB, email) => {
	for (user in userDB) {
		if (userDB[user].email === email) {
			return userDB[user];
		}
	}
	return false;
};

// const checkPassword = (userDB, password) => {
// 	for (user in userDB) {
// 		if (userDB[user].password === password) {
// 			return true;
// 		}
// 	}
// 	return false;
// };

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
	console.log('Cookies', req.cookies); // {username: 'sam' }
	const currentUser = req.cookies.username; // randomID
	const templateVars = { urls: urlDatabase, user: users[currentUser] };

	res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
	const currentUser = req.cookies.username; // randomID
	const templateVars = { user: users[currentUser] };

	res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
	const currentUser = req.cookies.username; // randomID
	const templateVars = {
		shortURL: req.params.shortURL,
		longURL: urlDatabase[req.params.shortURL],
		user: users[currentUser],
	};
	res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
	// req.params: {shortURL: <typedURL> }
	const longURL = urlDatabase[req.params.shortURL];

	res.redirect(longURL);
});

app.get('/register', (req, res) => {
	const currentUser = req.cookies.username; // randomID
	const templateVars = { user: users[currentUser] };

	res.render('urls_register', templateVars);
});

app.get('/login', (req, res) => {
	const currentUser = req.cookies.username; // randomID
	const templateVars = { user: users[currentUser] };

	res.render('urls_login', templateVars);
});

// POST

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

// Set a cookie submitted by the login form in the urls_login
app.post('/login', (req, res) => {
	console.log('req.body', req.body); // { email: <email>, password: <password> }
	const submittedEmail = req.body.email;
	const submittedPassword = req.body.password;

	if (req.body.email === '' || req.body.password === '') {
		res.status(403).send('Email and password must be submitted');
	}

	if (!checkEmail(users, submittedEmail)) {
		res.status(403).send('Email not found');
	}

	if (checkEmail(users, submittedEmail)) {
		const foundUser = checkEmail(users, submittedEmail);

		if (foundUser.password === submittedPassword) {
			res.cookie('username', foundUser.id);
			res.redirect('/urls');
		} else {
			res.status(403).send('Incorrect password');
		}
	}
});

// Log out and clear cookie: _header
app.post('/logout', (req, res) => {
	res.clearCookie('username');
	res.redirect('/urls');
});

// Create a new user from: urls_register
app.post('/register', (req, res) => {
	// console.log(req.body); // {email: '...com', password: '...'}
	if (req.body.email === '' || req.body.password === '') {
		res.status(400).send('Email and password must be submitted');
	} else if (checkEmail(users, req.body.email)) {
		res.status(400).send('Email already registered');
	} else {
		const randomID = generateRandomString();

		users[randomID] = {
			id: randomID,
			email: req.body.email,
			password: req.body.password,
		};
		console.log(users);

		res.cookie('username', randomID);
		res.redirect('/urls');
	}
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});
