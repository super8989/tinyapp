# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Features

- Create a new user
- Log in as a registered user
- View a list of your created tiny URLs
- Edit/Delete your own tiny URLs
- Hashed passwords for enhanced security
- A user session stored with cookies: Session identifier on the client within a cookie and session data stored on the server

## Final Product

!["screenshot of index page not logged in"](https://github.com/super8989/tinyapp/blob/master/docs/urls_index.png?raw=true)

!["screenshot of create new URL"](https://github.com/super8989/tinyapp/blob/master/docs/urls_new.png?raw=true)

!["screenshot of shortURL"](https://github.com/super8989/tinyapp/blob/master/docs/urls_shortURL.png?raw=true)

!["screenshot home page with list of urls"](https://github.com/super8989/tinyapp/blob/master/docs/urls_index_logged_in.png?raw=true)

## Technical Information/Dependencies

- HTML
- CSS
- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
