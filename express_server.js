const express = require('express');
const app = express();
const PORT = 8080;

// express to use ejs as templating engine
app.set('view engine', 'ejs');

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
	// res.render('urls_index', urlDatabase);
});

app.get('/urls/:shortURL', (req, res) => {
	let templateVars = {
		shortURL: req.params.shortURL,
		longURL: urlDatabase[req.params.shortURL],
	};
	res.render('urls_show', templateVars);
});

// app.get('/hello', (req, res) => {
// 	res.send('<html><body>Hello <b>World HTML</b></body></html>\n');
// });

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});
