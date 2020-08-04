const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

// express to use ejs as templating engine
app.set('view engine', 'ejs');

// convert request body from a Buffer into string and then add the data to req object under the key of 'body'
app.use(bodyParser.urlencoded({ extended: true }));

const urlDatabase = {
	b2xVn2: 'http://www.lighthouselabs.ca',
	'9sm5xK': 'http://www.google.com',
};

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
	res.send('Hello World');
});

// respond with JSON string of urlDatabase
app.get('/urls.json', (req, res) => {
	res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
	let templateVars = { urls: urlDatabase };
	res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
	res.render('urls_new');
});

app.get('/urls/:shortURL', (req, res) => {
	let templateVars = {
		shortURL: req.params.shortURL,
		longURL: urlDatabase[req.params.shortURL],
	};
	res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
	console.log(req.body);
	res.send('OK');
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});
