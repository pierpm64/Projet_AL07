// Module d'appel des apis TAN
// Doc complète API sur : https://data.nantesmetropole.fr/explore/dataset/244400404_api-temps-reel-tan/information/ 
// Projet AL07 - Juillet 2021
// By PierPM

"use strict";

const request = require('request');
const addMinutes = require('date-fns/addMinutes');
const addSeconds = require('date-fns/addSeconds');
const { json } = require('express');

// Determination prefix api TAN a appeler selon contexte
var apiPrefix = "http://open_preprod.tan.fr/ewp/";
var apiPrefixProd = "http://open.tan.fr/ewp/"
const envrun = getEnvParam("envrun","rect");
if (envrun === "prod") {
	apiPrefix = apiPrefixProd;
}

console.log("api_tan_v1 - Environnement Run : " + envrun + " / prefix api TAN : " + apiPrefix);


// recupere la liste des stations pour une lattitude et longitude
function getTanStations(latitude=0,longitude=0) {
	return new Promise (resolve => {
		// controle parametres bien numeriques
		if (isNaN(latitude) || isNaN(longitude) ) {
			console.log("getTanStation parameters : longitude et lattitude doivent etre numerique !");
			resolve(undefined) ;
			return;
		}
		// formatage parametres en format francais
		latitude = latitude.toLocaleString('fr-FR',{maximumFractionDigits:7});
		longitude = longitude.toLocaleString('fr-FR',{maximumFractionDigits:7});
		// appel API TAN
		let urlRequest = apiPrefix + "arrets.json/" + latitude + "/" + longitude;
		console.log("getTanStations url : " + urlRequest + " - at : " + getCurDateTime());
		request(urlRequest, { json: true }, (err, res, body) => {
			if (err) { console.log(err);resolve(undefined) ;return }
			let lstStations = res.body;
			// si pas de lieu trouvé proche adresse GPS, on considere API ne ramene rien 
			if (lstStations.toString() === "" || lstStations === undefined  ) {
				resolve(undefined);
				return;
			}
			
			// si pas undefined (erreur parametres api ou resultat vide), on reformate
			let lstAllLieux = [];
			if (lstStations !== undefined ) {
				for  (let station of lstStations) {
					/* let lstLignes = [];
					for (let ligne of station.ligne) {
						lstLignes.push(ligne.numLigne);
					} */
					let detailLieu = {
						"lieu" : station.codeLieu,
						"libelle": station.libelle,
						"distance" : station.distance,
		//				"lignes" : lstLignes
					}
					lstAllLieux.push(detailLieu);
				}
			}
			resolve(lstAllLieux);
		});
	});
}



// recupere la liste de tous les stations 
function getAllTanStations() {
	return new Promise (resolve => {
		// appel API TAN
		let urlRequest = apiPrefix + "arrets.json";
		console.log("getAllTanStations url : " + urlRequest + " - at : " + getCurDateTime());
		request(urlRequest, { json: true }, (err, res, body) => {
			if (err) { console.log(err);resolve(undefined) ;return }
			let lstStations = res.body;
			// si pas de lieu trouvé proche adresse GPS, on considere API ne ramene rien 
			if (lstStations.toString() === "" || lstStations === undefined  ) {
				resolve(undefined);
				return;
			}
			
			// si pas undefined (erreur parametres api ou resultat vide), on reformate
			let lstAllLieux = [];
			if (lstStations !== undefined ) {
				for  (let station of lstStations) {
					let lstLignes = [];
					for (let ligne of station.ligne) {
						lstLignes.push(ligne.numLigne);
					}
					let detailLieu = {
						"lieu" : station.codeLieu,
						"libelle": station.libelle,
						"lignes" : lstLignes
					}
					lstAllLieux.push(detailLieu);
				}
			}
			resolve(lstAllLieux);
		});
	});
}


// recupere les horaires prévus pour une station, une ligne, une direction
function getTanPlannedTime(station="null",ligne="0",sens=0) {
	return new Promise (resolve => {
		let urlRequest = apiPrefix + "horairesarret.json/" + station + "/" + ligne + "/" + sens;
		console.log("getTanPlanedTime url : " + urlRequest  + " - at : " + getCurDateTime() );
		request(urlRequest, { json: true }, (err, res, body) => {
			if (err) { console.log(err); resolve(undefined); return ; }
			let lstHoraires = res.body;
			// si pas d'horaire trouvé, on considere API ne ramene rien 
			if (lstHoraires === "" || lstHoraires === undefined ) {
				resolve(undefined);
				return;
			}
			
			// si pas undefined (erreur parametres api ou resultat vide), on formate
			let detPlannedTime = {};
			let detHoraires = lstHoraires["horaires"];
			if (detHoraires !== undefined) {
		
				for  (let horaire of detHoraires) {
					let plannedHeure = horaire.heure.padStart(3,'0').substr(0,2);
					let lstMinutes = [];
					for (let detMinute of horaire.passages) {
						lstMinutes.push(plannedHeure + ":" + detMinute.substr(0,2));
					}
					detPlannedTime[plannedHeure] =  lstMinutes;
				}
	
			} 
			// construction et renvoie de l'objet réponse 
			if (lstHoraires['ligne'] === undefined) {
				console.log("getTanPlanedTime url : " + urlRequest + 
					" / resultats incoherrents : " + JSON.stringify(lstHoraires))
				resolve(undefined);
			} 
			else {
				let infoHoraires = {
					"lieu" : station,
					"sens" : sens,
					"ligne" : ligne,
					"sens1" :  lstHoraires.ligne.directionSens1 ,
					"sens2" :  lstHoraires.ligne.directionSens2 ,
					"horaires" : detPlannedTime
				}
				
				resolve(infoHoraires);
			}

		});
	});
}

// recupere les horaires reels pour une station
function getTanRealTime(station="null") {
	return new Promise (resolve => {
		// let urlRequest = apiPrefix + "tempsattente.json/" + station;
		let urlRequest = apiPrefixProd  + "tempsattente.json/" + station;
		console.log("getTanRealTime url : " + urlRequest + " - at : " + getCurDateTime()) ;
		var lstTypesLignes = ["null","Tramway","Busway","Bus","Navibus"];
		request(urlRequest, { json: true }, (err, res, body) => {
			if (err) { console.log(err); resolve(undefined); return;}
			let lstTrajets = res.body;
			
			if (lstTrajets == "" || lstTrajets === undefined) {
				resolve(undefined);
				return;
			}
			// console.log("getTanRealTime - output : " + lstTrajets);
			
			// Recuperation date execution, arrondie (à la minutes superieure)
			let datCurR = new Date();
			// let datCur = addSeconds(datCurR,30)
			let datCur = addSeconds(datCurR,0)
			let datcurmm = datCur.getMonth() + 1;
			let timcurhh = datCur.getHours().toString().padStart(2,"0")
			// formatage date heure courante
			let datCurForm = datCur.getFullYear() + '-' + datcurmm.toString().padStart(2,"0") +
					'-' + datCur.getDate().toString().padStart(2,"0") 
			let timeCurForm = datCur.getHours().toString().padStart(2,"0") + 
					datCur.getMinutes().toString().padStart(2,"0") + datCur.getSeconds().toString().padStart(2,"0") + 
					"." + datCur.getMilliseconds().toString().padStart(3,"0")
	
			// declaration map correspondant à ligne + sens
			let detLignes = new Map();
			
			// Exploitation resultat API
			for  (let trajet of lstTrajets) {

				// Calcul heure de passage par rapport à heure courante + délai
				let tempTrajet = trajet.temps;
				if (tempTrajet == "Proche") {
					tempTrajet = 1;
				} else {
					tempTrajet = tempTrajet.split(' ')[0]
					if (isNaN(tempTrajet)) {
						continue;
					}
					tempTrajet = Number(tempTrajet);
				}
				let dateTrajet = addMinutes(datCur,tempTrajet);
				let timeTrajet = dateTrajet.getHours().toString().padStart(2,"0") + ':' +
									dateTrajet.getMinutes().toString().padStart(2,"0") 

				// recherche ligne dans la "map" des horaires 
				let lstPassages = [];
				let clef = trajet.ligne.numLigne + "_" + trajet.sens;
				let lstHoraires = detLignes.get(clef);
				if (lstHoraires === undefined) {
					lstHoraires = {
						"ligne" : trajet.ligne.numLigne , 
						"sens" : trajet.sens ,
						"realTime" :  trajet.tempsReel ,
						"codeType" : trajet.ligne.typeLigne,
						"libeType" : lstTypesLignes[trajet.ligne.typeLigne],
						"terminus" : trajet.terminus,
						"horaires" : lstPassages
					}  
					detLignes.set(clef,lstHoraires);
				} else {
					lstPassages = lstHoraires["horaires"];
				}

				// Mise à jour du trajet en Map
				lstPassages.push(timeTrajet);
				lstHoraires["horaires"] = lstPassages
				detLignes.set(clef,lstHoraires);

			}
			// formatage Map en liste d'object pour "export" 
			let lstTimes = []; 
			for  (let ligne of detLignes) {
				let objTime = {
					"LigneSens" : ligne[0],
					"details" : ligne[1]
				}
				lstTimes.push(objTime);
			}
			
			let objTimeAll = {
				"lieu" : station,
				"date" : datCurForm,
				"heure" : timcurhh,
				"time" : timeCurForm,
				"horaires" : lstTimes
			}
				
			resolve(objTimeAll);

		});
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
					curDate.getSeconds().toString().padStart(2,"0") + "." +
					curDate.getMilliseconds().toString().padStart(3,"0")
	return datCurForm + " " + timeCurForm;
}

// function de retour générique
let funcRet = function(param=undefined)
{  
	return new Promise (
		resolve => {
			resolve(param)
		}
	);
};


// function générique avec callbacl
async function GenericAsync(ParFunc={},
	callback=funcRet) {
    let retour  = await ParFunc;
	return callback(retour);
}


// function de récupération des variables d'environnement, ramene un objet
function getAllEnvParms(param=undefined,valdef=undefined) {
	let env = process.env;
	let objParms = {};
	if (param !== undefined) {
		if (env[param] !== undefined) {
			objParms[param] = env[param];
		} else {
			objParms[param] = valdef;
		}
	}
	else {
		for (let valpar  in env) {
			objParms[valpar] = env[valpar];
		}
	}	
	return objParms;
}

// export All Functions
exports.getTanStations = getTanStations;
exports.getAllTanStations = getAllTanStations;
exports.getTanPlannedTime = getTanPlannedTime;
exports.getTanRealTime = getTanRealTime;
exports.getEnvParam = getEnvParam;
exports.getCurDateTime = getCurDateTime;
exports.GenericAsync = GenericAsync;
exports.getAllEnvParms = getAllEnvParms;