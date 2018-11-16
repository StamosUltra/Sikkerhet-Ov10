var salt;
var user = {
  'name': 'root',
  'password': 'password123',
  'salt': '',
  'hash': '',
  'token': ''
};

var wrongPass = {
  'name': 'root',
  'password': 'feilpassord',
  'salt': '',
  'hash': '',
  'token': ''
}
console.log('script running...');

$(document).ready(function() {
  $("#demo").html("Hello, World!");

  console.log(JSON.stringify(user));
  getsalt(user);
  setTimeout(function() {
    getsalt(wrongPass);
  }, 5000);
  setTimeout(function() {
    getsalt(user);
  }, 10000);
});

function hashPassword(user) {
  console.log('hashing password for ' + user.name + ' using salt: ' + user.salt);
  salt = JSON.parse(user.salt);
  var key = forge.pkcs5.pbkdf2(user.password,salt, 1000, 32, forge.sha1.create());
  keyHex = forge.util.bytesToHex(key);
  user.hash = keyHex;
  login(user);
}

function getsalt(user) {
  console.log('getting salt for: ' + user.name);
  $.ajax({
      type: 'POST',
      data: JSON.stringify(user),
      contentType: 'application/json',
      url: 'http://127.0.0.1:8080/getsalt',
      success: function (data) {
        user.salt = JSON.stringify(data);
        hashPassword(user)

      },
      error: function (data) {
        console.log('err: ' + data);
      }
    });
}

function login (user) {
  console.log('login in for: ' + user.name);
  $.ajax({
    type: 'POST',
    data: JSON.stringify(user),
    contentType: 'application/json',
    url: 'http://127.0.0.1:8080/login',
    success: function(data) {
      console.log('data: ' + data);
      if (data != false) {
         user.token = JSON.stringify(data);
         console.log(JSON.stringify(user));
       }
       else console.log('Wrong passwrd');
    },
    error: function(data) {
      console.log('err: ' + JSON.stringify(data));
    }
  });
}
