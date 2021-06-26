// Serveur NODE.JS projet AL07 
// Fiabilitié des transports en communs à Nantes
// By PierPM _ 20210621


var express = require('express');
var transportNantesApiRoutes = require('./transport-nantes-api-routes');
var app = express();

//support parsing of JSON post data
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json() ;
app.use(jsonParser);


app.use(transportNantes.apiRouter); //delegate REST API routes to apiRouter(s)

app.listen(8282 , function () {
    console.log("Le Serveur Node.js ecoute sur le port 8282");
});