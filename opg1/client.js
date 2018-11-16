var Client = require('node-rest-client').Client;

var client = new Client();

var salt;
var user;

// direct way
client.get("http://127.0.0.1:8080/users/all", function (data, response) {
    // parsed response body as js object
     console.log(data);
     salt = data;
     console.log('salt: ' + data);
    // raw response
    // console.log(response);
});
client.get("http://127.0.0.1:8080/users/1", function (data, response) {
  user = data;
  console.log(user);
});
