const express = require('express');
const app = express();
const PORT = 8080;

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

app.get('/hello', (req, res) => {
	res.send('<html><body>Hello <b>World HTML</b></body></html>\n');
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});
