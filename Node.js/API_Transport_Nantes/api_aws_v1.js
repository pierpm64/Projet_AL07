// Module d'appel des apis S3 TAN
// Projet AL07 - Juillet 2021
// By PierPM

"use strict";

const request = require('request');
const xmltool = require('xml2json-light')
const addMinutes = require('date-fns/addMinutes');
const addSeconds = require('date-fns/addSeconds');
const { json } = require('express');
const curDate = new Date();

// Determination prefix api TAN a appeler selon contexte
var apiUrl = "https://al07-rect.s3.eu-west-3.amazonaws.com"
if (getEnvParam("envrun") === "prod") {
	var apiUrl = "https://al07-prod.s3.eu-west-1.amazonaws.com";
}


// recupere la directory des fichiers
function getAWSBucketDirectory() {
	// appel API AWS
	console.log("getAWSBucketDirectory url : " + apiUrl + " - at : " + getCurDateTime());
	request(apiUrl, { json: false  }, (err, res, body) => {
		if (err) { console.log(err);resolve(undefined) ;return }
		let lstFiles = res.body;
		// si pas de fichier trouvé, on sort
		if (lstFiles.toString() === "" || lstFiles === undefined  ) {
			resolve(undefined);
			return;
		}
		let dirJson = xmltool.xml2json(lstFiles);
		
		let bucket = dirJson.ListBucketResult.Name;
		let content = dirJson.ListBucketResult.Contents;
		console.log("AWS S3 bucket Name : " + bucket)
			
		// si pas undefined (erreur parametres api ou resultat vide), on reformate
		for  (let file of content) {
			let fileName = file.Key;
			// ne ramene pas les directory
			if (fileName.endsWith('/')) {
				continue
			} 
			// ne ramene pas les fichiers dans directory
			if (fileName.indexOf('/') > 0 ) {
				continue
			} 

			let datModstr  = file.LastModified ;
			let dateMod = new Date(datModstr);

			console.log("fichier : " + file.Key + " / modified : " +datModstr + 
			" / " + getCurDateTime(dateMod) + " / taille " + file.Size);
		}
	})
}

// recupere une variable d'environnement dans le contexte , et si non trouve, prend la valeur par defaut
function getEnvParam(param,defaut=undefined) {
	var env = process.env;
	var value = env[param];
	if (value === undefined) {
		return defaut;
	} else {
		return value;
	}	
}

// recupere la date courante et la formate
function getCurDateTime(curDate=new Date()) {
	let curMonth = curDate.getMonth() + 1;
	let datCurForm = curDate.getFullYear() + "/" + curMonth.toString().padStart(2,"0") +
					"/" + curDate.getDate().toString().padStart(2,"0") 
	let timeCurForm = curDate.getHours().toString().padStart(2,"0") + ":" +
					curDate.getMinutes().toString().padStart(2,"0") + ':' + 
					curDate.getSeconds().toString().padStart(2,"0")
	return datCurForm + " " + timeCurForm;
}

getAWSBucketDirectory();

 /*
// export All Functions
exports.getTanStations = getTanStations;
exports.getAllTanStations = getAllTanStations;
exports.getTanPlannedTime = getTanPlannedTime;
exports.getTanRealTime = getTanRealTime;
exports.getEnvParam = getEnvParam;
exports.getCurDateTime = getCurDateTime;
exports.GenericAsync = GenericAsync;
exports.getAllEnvParms = getAllEnvParms; */