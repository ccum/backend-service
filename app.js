var express = require('express');
var userFile = require('./users.json');
var bodyParser = require('body-parser');
var app = express();
var port = process.argv.PORT || 3000;
var URLbase='/apiperu/v1/';

app.use(bodyParser.json());

//GET users

app.get(URLbase + 'users', function(req, res){
  console.log("GET /apiperu/v1/users");
  res.status(200);
  res.send(userFile)

});
//GET users by ID
app.get(URLbase + 'users/:id', function(req, res){
    console.log("GET /apiperu/v1/users/:id");
    let pos = req.params.id
    //console.log(req.query.id); ---> para query params
    res.send(userFile[pos]);
});
//POST users
app.post(URLbase + 'users', function(req, res){
    console.log("POST /apiperu/v1/users/");
    console.log(req.body);
    let newID = userFile.length + 1;
    let newUser = {
      "userID" : newID,
      "first_name": req.body.first_name,
      "last_name" : req.body.last_name,
      "email" : req.body.email,
      "password" : req.body.password
    }
    userFile.push(newUser);
    console.log(userFile);
    res.status(201);
    res.send({"msg":"Usuario añadido satisfactoriamente", newUser});
});


//PUT users

app.put(URLbase + 'users/:id', function(req, res){
    console.log("PUT /apiperu/v1/users/");
    let pos = req.params.id-1;
    var user = userFile[pos];
    //userFile.splice(user,1);

    if(user){
      user.first_name = req.body.first_name;
      user.last_name = req.body.last_name;
      user.email = req.body.email;
      user.password = req.body.password;
      userFile.splice(pos, 1, user);
      console.log(userFile);
      res.send({"msg":"modificacion correcta", user});
    }
    else {
      res.status(404);
      res.send({"msg":"Elemento no encontrado"});
    }
});

//DELETE users
app.delete(URLbase + 'users/:id', function(req, res){
    console.log("PUT /apiperu/v1/users/");
    let pos = req.params.id-1;
    var user = userFile[pos];
    if(user){
      userFile.splice(pos, 1);
      console.log(userFile);
      res.send({"msg":"eliminacion correcta", user});
    }
    else {
      res.status(404);
      res.send({"msg":"Elemento no encontrado"});
    }
});


//https://www.mockaroo.com/ obtener datos
// app.get('/', function (req, res) {
//   res.send('<h1>Hello Peru 4 !</h1>');
// });
// app.get('/user/:id', function(req, res) {
//   res.send('user ' + req.params.id);
// });

app.listen(port);
