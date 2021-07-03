// Module d'appel des apis TAN
// Doc complète API sur : https://data.nantesmetropole.fr/explore/dataset/244400404_api-temps-reel-tan/information/ 
// Projet AL07 - Juillet 2021
// By PierPM
const request = require('request');
const addMinutes = require('date-fns/addMinutes');
const addSeconds = require('date-fns/addSeconds');

// Determination prefix api TAN a appeler selon contexte
var apiPrefix = "http://open_preprod.tan.fr/ewp/";
var apiPrefixProd = "http://open.tan.fr/ewp/"
if (getEnvParam("envrun") === "prod") {
	apiPrefix = apiPrefixProd;
}


// recupere la liste des stations pour une lattitude et longitude
var getTanStations = function(latitude=0,longitude=0) {
	let urlRequest = apiPrefix + "arrets.json/" + latitude + "/" + longitude;
	console.log("getTanStations url : " + urlRequest);
	request(urlRequest, { json: true }, (err, res, body) => {
		if (err) { console.log(err); return undefined; }
		let lstStations = res.body;
		// si pas de lieu trouvé proche adresse GPS, on considere API ne ramene rien 
		if (lstStations === "") {
			return undefined;
		}
		
		// si pas undefined (erreur parametres api ou resultat vide), on reformate
		let lstAllLieux = [];
		if (lstStations !== undefined ) {
			for  (station of lstStations) {
				let lstLignes = [];
				for (ligne of station.ligne) {
					lstLignes.push(ligne.numLigne);
				}
				let detailLieu = {
					"lieu" : station.codeLieu,
					"libelle": station.libelle,
					"distance" : station.distance,
					"lignes" : lstLignes
				}
				lstAllLieux.push(detailLieu);
			}
		}
		return lstAllLieux;

	});
}

// recupere les horaires prévus pour une station, une ligne, une direction
var getTanPlannedTime = function(station="null",ligne=0,sens=0) {
	let urlRequest = apiPrefix + "horairesarret.json/" + station + "/" + ligne + "/" + sens;
	console.log("getTanPlanedTime url : " + urlRequest);
	request(urlRequest, { json: true }, (err, res, body) => {
		if (err) { console.log(err); return undefined; }
		let lstHoraires = res.body;
		// si pas d'horaire trouvé, on considere API ne ramene rien 
		if (lstHoraires === "") {
			return undefined;
		}
		
		// si pas undefined (erreur parametres api ou resultat vide), on formate
		let detPlannedTime = new Map();
		let detHoraires = lstHoraires["horaires"];
		if (detHoraires !== undefined) {
    
			for  (horaire of detHoraires) {
				let plannedHeure = horaire.heure.padStart(3,'0').substr(0,2);
				let lstMinutes = [];
				for (detMinute of horaire.passages) {
					lstMinutes.push(plannedHeure + ":" + detMinute.substr(0,2));
				}
				detPlannedTime[plannedHeure] =  lstMinutes;
			}
 
		} 
		// construction et renvoie de l'objet réponse 
		let infoHoraires = {
			"lieu" : station,
			"sens" : sens,
			"ligne" : lstHoraires.ligne.numLigne ,
			"sens1" :  lstHoraires.ligne.directionSens1 ,
			"sens2" :  lstHoraires.ligne.directionSens2 ,
			"horaires" : detPlannedTime
		}
		
		return infoHoraires;

	});
}

// recupere les horaires reels pour une station
var getTanRealTime =  function(station="null") {
	let urlRequest = apiPrefix + "tempsattente.json/" + station;
	console.log("getTanRealTime url : " + urlRequest + " - at : " + new Date()) ;
	var lstTypesLignes = ["null","Tramway","Busway","Bus","Navibus"];
	request(urlRequest, { json: true }, (err, res, body) => {
		if (err) { console.log(err); return undefined; }
		let lstTrajets = res.body;
		
		if (lstTrajets == "") {
			return undefined;
		}
		console.log("getTanRealTime - output : " + lstTrajets);
		
		// Recuperation date execution, arrondie (à la minutes superieure)
		let datCurR = new Date();
		let datCur = addSeconds(datCurR,30)
		 // formatage date heure courante
		let datCurForm = datCur.getFullYear() + datCur.getMonth().toString().padStart(2,"0") +
                datCur.getDate().toString().padStart(2,"0") 
		let timeCurForm = datCur.getHours().toString().padStart(2,"0") + 
                datCur.getMinutes().toString().padStart(2,"0") + datCur.getSeconds().toString().padStart(2,"0") + 
                "." + datCur.getMilliseconds().toString().padStart(3,"0")
  
		// declaration map correspondant à ligne + sens
		let detLignes = new Map();
		
		// Exploitation resultat API
		for  (trajet of lstTrajets) {

			// Calcul heure de passage par rapport à heure courante + délai
			let tempTrajet = trajet.temps;
			if (tempTrajet == "Proche") {
				tempTrajet = 0;
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
		for  (ligne of detLignes) {
			let objTime = {
				"LigneSens" : ligne[0],
				"details" : ligne[1]
			}
			lstTimes.push(objTime);
		}
		
		let objTimeAll = {
			"lieu" : station,
			"date" : datCurForm,
			"time" : timeCurForm,
			"horaires" : lstTimes
		}
			

		return objTimeAll;

	});
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

// export Tan Functions
exports.getTanStations = getTanStations;
exports.getTanPlannedTime = getTanPlannedTime;
exports.getTanRealTime = getTanRealTime;

// Modif de test