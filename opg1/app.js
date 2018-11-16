var express = require('express');
const crypto = require('crypto');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var users = [
  {
    name: 'root',
    password: '',
    salt: ''
  },
  {
    name: 'user1',
    password: "36a90c22d011c27ddad0f88befa11ccf59b97c83f09f99d9c3b5b6bad8a95b11",
    salt: "salt"
  }
]
app.post('/getsalt', (req, res, body) => {
  var userIn = JSON.stringify(req.body);
  var userParsed = JSON.parse(userIn);
  console.log(userParsed);
  for (var i = 0; i < users.length; i++) {
    if (userParsed.name == users[i].name) {
      if (users[i].salt === '') {
        console.log('generating salt for: ' + userParsed.name);
        userSalt = genRandomString(64);
        console.log('salt: ' + userSalt);
        users[i].salt = userSalt;
      }
      res.send(users[i].salt);
      return
    }
  }
  console.log('no user found');
  res.send(-1);
});

app.post('/login', (req, res, body) => {
  var hashedPass;
  var userIn = JSON.stringify(req.body);
  var userParsed = JSON.parse(userIn);
  console.log('user: ' + userParsed.name + ' login in...');
  var user;
  for (var i = 0; i < users.length; i++) {
    if (userParsed.name == users[i].name) {
      console.log('user ' + userParsed.name + ' found');
      user = users[i];
      break;
    }
  }
  if (user === undefined) {
    console.log('user ' + userParsed.name + ' not found');
    res.send(-1);
  }
  crypto.pbkdf2(userParsed.password, user.salt, 40000, 32, 'sha1', (err, derivedKey) => {
    console.log('hashing password...');
    hashedPass = (derivedKey.toString('hex'));
    if (user.password == '') {
      console.log('new user, assigning password...');
      for (var i = 0; i < users.length; i++) {
        if (user.name == users[i].name) {
          users[i].password = hashedPass;
          break;
        }
      }
    }
    else {
      console.log('verifying password...');
      if (hashedPass !== user.password) {
        console.log('not a match, no token generated');
        res.send(false);
        return;
      }
    }
    console.log('password match\nGenrating token...');
    var session = genRandomString(64);
    user['token'] = session;
    user['tokenlife'] = Date.now();
    console.log(user);
    res.send(session)
  });
});

var server = app.listen(8080, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};
