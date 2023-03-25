const express = require('express');
const app = express();
const config = require('./config');
const axios = require('axios')

const port = process.env.PORT || 3000;

let access_token = "";

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index', { client_id: config.clientID });
});


// callback route
app.get(config.callbackURL, (req, res) => {
  const requestToken = req.query.code

  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${config.clientID}&client_secret=${config.clientSecret}&code=${requestToken}`,    
    headers: {
      accept: 'application/json'
    }
  }).then((response) => {
    access_token = response.data.access_token
    res.redirect('/profile');
  }).catch(() => {
    res.redirect('/');
  })
})

// when the user is logged in then show the information
app.get('/profile', function(req, res) {
  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token
    }
  }).then((response) => {
    res.render('profile', { userData: response.data });
  }).catch(() => {
    res.redirect('/')
  })
});

// remove the current access token and redirect to homepage
app.get('/logout', (req, res) => {
  access_token = ""
  res.redirect('/');
});

app.listen(port,() =>{
	console.log(`listening on port ${port}`);
} );