var express = require('express');
var userFile = require('./users.json');
var bodyParser = require('body-parser');
var requestJson = require('request-json');
var app = express();
var port = process.argv.PORT || 3000;
var URLbase='/apiperu/v2/';

var baseMlabURL = "https://api.mlab.com/api/1/databases/cecum_api_test/collections/";
var API_KEY = "apiKey=921wtWhfU-2X-4oesZqOCJvxE0rzlSC_";

app.use(bodyParser.json());


//npm install cors --save
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//GET users

app.get(URLbase + 'users', function(req, res){
  console.log("GET /apiperu/v2/users");
  //clienteMlab = requestJson.createClient(baseMlabURL + "/user?" + API_KEY)
  clienteMlab = requestJson.createClient(baseMlabURL);
  clienteMlab.get('user?'+ API_KEY , function(err, resM, body) {
     if (!err) {
       res.send(body)
     }
  });
});
//GET users by ID
app.get(URLbase + 'users/:id', function(req, res){
    console.log("GET /apiperu/v2/users/:id");
    let id = req.params.id
    console.log(id);
    var query = 'q={"userID":' + id + '}&f={"first_name":1, "last_name":1, "_id":0}'
    clienteMlab = requestJson.createClient(baseMlabURL + "user?" + query + "&l=1&" + API_KEY)
    clienteMlab.get('', function(err, resM, body) {
        if (!err) {
          if (body.length > 0){
            console.log(body[0]);
            res.send(body[0]);
          }
          else {
            response ={"msg": "Usuario no encontrado"};
            res.status(404).send(response);
         }
       }
    });
});
//POST users
app.post(URLbase + 'users', function(req, res){
    console.log("POST /apiperu/v2/users");
    clienteMlab = requestJson.createClient(baseMlabURL);
    clienteMlab.get("user?"+ API_KEY , function(err, resM, body) {
      if (!err) {
        console.log(body.length);
        let body_1 = body.length
        let newID = body_1 + 2;
        let newUser = {
          "userID" : newID,
          "first_name": req.body.first_name,
          "last_name" : req.body.last_name,
          "email" : req.body.email,
          "password" : req.body.password
        };
        clienteMlab.post("user?"+ API_KEY, newUser ,function(err, resM, body){
             response ={"msg": "Usuario creado correctamente",newUser};
             res.status(200).send(response);
        });
      }
      else {
         response ={"msg": "error"};
         res.status(404).send(response);
      }
    });
});


//PUT users

app.put(URLbase + 'users/:id', function(req, res){
    console.log("PUT /apiperu/v1/users/");
    let id = req.params.id;
    var query = 'q={"userID":' + id + '}&';
    console.log("llega 1");
    clienteMlab = requestJson.createClient(baseMlabURL);
    clienteMlab.get("user?"+ query+ "&l=1&" + API_KEY, function(err, resM, body) {
      console.log("llega");
      if (!err) {
        console.log(body[0]);
        body[0].first_name = req.body.first_name,
        body[0].last_name = req.body.last_name;
        body[0].email = req.body.email;
        body[0].password = req.body.password;
        clienteMlab.put("user?"+ API_KEY, body[0] , function(err1, resM1, body1){
             response ={"msg": "Usuario actualizado correctamente"};
             res.status(200).send(response);
        });

      }
      else {
         response ={"msg": "error"};
         res.status(404).send(response);
      }

    });
});

//DELETE users
app.delete(URLbase + 'users/:id', function(req, res){
  let id = req.params.id;
  var query = 'q={"userID":' + id + '}&';
  console.log("llega 1");
  clienteMlab = requestJson.createClient(baseMlabURL);
  clienteMlab.get("user?"+ query+ "&l=1&" + API_KEY, function(err, resM, body) {
    console.log("llega");
    if (!err) {
      console.log(body[0]);
      let query_delete = body[0]._id.$oid + "?";
      clienteMlab.delete("user/"+ query_delete + API_KEY, function(err1, resM1, body){
          console.log(resM1.body);
           response ={"msg": "Usuario elimindo correctamente"};
           res.status(200).send(response);
      });
    }
    else {
       response ={"msg": "error"};
       res.status(404).send(response);
    }

  });
});

//LOGIN
app.post(URLbase + 'login', function(req,res){
  // let email= req.headers.email;
  // let password = req.headers.password;
  console.log('login');
  let email= req.body.email;
  let password = req.body.password;
  var query= 'q={"email":"'+email+'", "password":"'+password+'"}&';
  clienteMlab = requestJson.createClient(baseMlabURL);
  clienteMlab.get("user?"+ query +API_KEY, function(err,resM,body){
    if(!err){
      if(body.length>=1){
        var query_1= '?q={"id": ' + body[0]._id.$oid + '}&'
        var cambio = '{"$set":{"logged":true}}';
        clienteMlab.put("user?"+query_1+ API_KEY,JSON.parse(cambio),function(errP,resP,bodyP){
          console.log(bodyP.n);
          var response ={"msg": "login correcto" , 'user':body[0].nombre};
          //res.send({"login":"ok", "id":body[0].id, "nombre":body[0].nombre, "apellidos":body[0].apellidos});
          res.status(200).send(response);
        });
      }
      else{
        response ={"msg": "Usuario no encontrado"};
        res.status(404).send(response);
        //res.status(404).send('Usuario no encontrado')
      }
    }
  });
});

//LOG OUT
app.post(URLbase + 'logout', function(req,res){
  console.log('login');
  let email= req.body.email;
  var query= 'q={"email":"'+email+'",  "logged":true}&';
  clienteMlab = requestJson.createClient(baseMlabURL);
  clienteMlab.get("user?"+ query +API_KEY, function(err,resM,body){
    if(!err){
      if(body.length>=1){
        var query_1= '?q={"id": ' + body[0]._id.$oid + '}&'
        var cambio = '{"$unset":{"logged":true}}';
        clienteMlab.put("user?"+query_1+ API_KEY,JSON.parse(cambio),function(errP,resP,bodyP){
          console.log(bodyP.n);
          var response ={"msg": "logout correcto" , 'user':body[0].nombre};
          //res.send({"login":"ok", "id":body[0].id, "nombre":body[0].nombre, "apellidos":body[0].apellidos});
          res.status(200).send(response);
        });
      }
      else{
        response ={"msg": "Usuario no encontrado"};
        res.status(404).send(response);
        //res.status(404).send('Usuario no encontrado')
      }
    }
  });
});

//GET CUENTAS

app.get(URLbase + 'accounts', function(req,res){
  console.log('/apiperu/v2/accounts');
  clienteMlab = requestJson.createClient(baseMlabURL);
  clienteMlab.get('account?'+ API_KEY , function(err, resM, body) {
     if (!err) {
       res.send(body)
     }
  });


});
app.listen(port);
