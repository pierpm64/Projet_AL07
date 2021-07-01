// Serveur NODE.JS projet AL07 
// Fiabilitié des transports en communs à Nantes
// By PierPM _ 20210621


const express = require('express');
const transportNantesApiRoutes = require('./transport-nantes-api-routes');
const api_tan = require('./api_tan_v1');
var app = express();

//support parsing of JSON post data
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json() ;
app.use(jsonParser);

// open cors
const cors = require('cors');
app.use(cors());

//delegate REST API routes to apiRouter(s)
app.use(transportNantesApiRoutes.apiRouter); 

// get envrun and port
let envrun = api_tan.getEnvParam("envrun","devt")
let portNum = api_tan.getEnvParam("NodePort",8282)

app.listen(portNum , function () {
    console.log("Le Serveur Node.js ecoute sur le port " + portNum + " (envrun=" + envrun + ")");
});