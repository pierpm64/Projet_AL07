// module principal de l'api de qualité des transports communs à Nantes
// Projet fin de cycle AL07 - Juillet 2021
// by PierPM
var express = require('express');
const requestIp = require('request-ip');
const api_tan  = require('./api_tan_v1');
const apiRouter = express.Router();
var dns = require('dns');
const process = require('process');
const address = require('address');
var myGenericMongoClient = require('./my_generic_mongo_client');


console.log('===> plateforme : ' + process.platform + " / pid : " + process.ppid)
console.log('===> ip v4 : ' + address.ip() + " / ip v6  : " + address.ipv6())


function getIdName(ip) {
	require('dns').reverse(ip, function(err, domains) {
    if(err) {
        return err.toString();
    }
    return domains;
})};



// Async function to call TAN API
async function AppelApi(parfunc=api_tan.GenericAsync(api_tan.getTanStations(47.2133057,-1.5604042)),
retour=function(par){console.log("demo :" + JSON.stringify(par))}) {
    let demo = await parfunc 
    retour(demo);
    // console.log("demo : " + JSON.stringify(demo));
}

//exemple URL: http://localhost:8282/transport-nantes-api/public/Station (retoune toutes les lignes pour une station )
apiRouter.route('/transport-nantes-api/public/station/:code')
	.get(function (req, res, next) {
		var Codestation = req.params.code;
		console.log("GET,Station:" + Codestation);
		myGenericMongoClient.genericFindList('TanAllStations', {_id : Codestation},
			function (err, station) {
				console.log("station trouvé : " + station)
				if (station == null || station == "")
					res.status(404).send({ err: "Station non trouvée" });
				else
					res.send(station);
			});
		});//end of genericFindList()


//exemple URL: http://localhost:8282/transport-nantes-api/public/plannedtime?station=...&ligne=...&date==...
//  (retoune les horaires prévus)
apiRouter.route('/transport-nantes-api/public/plannedtime')
	.get(function (req, res, next) {
		var Codestation = req.query.station;
		var Codeligne = req.query.ligne;
		var datepar = req.query.date;
		var senspar = req.query.sens;
		// construction query selon parametres passés
		querytest = {};
		if (Codestation !== undefined) {
			querytest["lieu"] = Codestation
		}
		if (Codeligne !== undefined) {
			querytest["ligne"] = Codeligne;
		}
		if (datepar !== undefined) {
			querytest["date"] = datepar;
		}
		if (senspar !== undefined && !isNaN(senspar)) {

			querytest["sens"] = Number(senspar);
		}
		console.log("GET,TanPlannedTime,Query:" + JSON.stringify(querytest));
		// Recherche infos dans MongoDB
		myGenericMongoClient.genericFindList('TanPlannedTime',querytest,
			function (err, horaires) {
				if (horaires == null || horaires == "")
					res.status(404).send({ err: "Horaires planifié non trouvé" });
				else
					res.send(horaires);
			});
		});//end of getPlannedTime()

//exemple URL: http://localhost:8282/transport-nantes-api/public/plannedtime?station=...&ligne=...&date==...
//  (retoune les horaires prévus)
apiRouter.route('/transport-nantes-api/public/realtime')
	.get(function (req, res, next) {
		var Codestation = req.query.station;
		var Codeligne = req.query.ligne;
		var datepar = req.query.date;
		var heurepar = req.query.heure;
		var senspar = req.query.sens;
		// construction query selon parametres passés
		querytest = {};
		if (Codeligne !== undefined) {
			querytest["ligne"] = Codeligne;
		}
		if (Codestation !== undefined) {
			querytest["lieu"] = Codestation;
		}
		if (datepar !== undefined) {
			querytest["date"] = datepar;
		}
		if (heurepar !== undefined) {
			querytest["heure"] = heurepar;
		}
		if (senspar !== undefined && !isNaN(senspar)) {

			querytest["sens"] = Number(senspar);
		}
		console.log("GET,TanRealTime,Query:" + JSON.stringify(querytest));
		// Recherche infos dans MongoDB
		myGenericMongoClient.genericFindList('TanRealTime',querytest,
			function (err, horaires) {
				if (horaires == null || horaires == "")
					res.status(404).send({ err: "Horaires Reel non trouvé" });
				else
					res.send(horaires);
			});
		});//end of getRealTime()


//exemple URL: http://localhost:8282/transport-nantes-api/public/lieu/Bourse
apiRouter.route('/transport-nantes-api/public/lieu/:code')
	.get(function (req, res, next) {
		var codeLieu = req.params.code;
		console.log("GET,lieus:" + codeLieu);
		myGenericMongoClient.genericFindOne('lieus',
			{ 'lieu': codeLieu },
			function (err, lieu) {
				if (lieu == null)
					res.status(404).send({ err: 'lieu non trouvé' });
				else
					res.send(lieu);
			});

	});

//exemple URL: http://localhost:8282/transport-nantes-api/public/lstLieus (retoune tous les lieux )
apiRouter.route('/transport-nantes-api/public/lstLieus')
	.get(function (req, res, next) {
			// by default, the ip address will be set on the `clientIp` attribute

		let clientIp = requestIp.getClientIp(req); 
		
		/*let objtmp = req;
		for (let param in objtmp) {
			console.log("param : " + param);
		} */

		
		console.log("GET,All lieus - by " +  clientIp + ' / ' + getIdName(clientIp) +
		" - le " + api_tan.getCurDateTime());
		myGenericMongoClient.genericFindList('lieus', {},function (err, lieus) {
			res.send(lieus);
		});//end of genericFindList()
	});

// http://localhost:8282/transport-nantes-api/private/role-admin/lieu en mode post
// avec { "lieu" : "libel court" , "nom" : "libel long" , description : "description long", latitude" : 123, longitude : 123 } 
// dans req.body
apiRouter.route('/transport-nantes-api/private/role-admin/lieu')
	.post(function (req, res, next) {
		var nouveauLieu = req.body;
		console.log("POST,nouveauLieu=" + JSON.stringify(nouveauLieu));

		let latitude = nouveauLieu.latitude;
		if (isNaN(latitude)) {
			res.status(500).send({ err: 'Latitude non numerique !' });
		}

		let longitude = nouveauLieu.longitude;
		if (isNaN(longitude)) {
			res.status(500).send({ err: 'longitude non numerique !' });
		}
		
		// 1 - verification que le lieu n'existe pas en MongoDB
		myGenericMongoClient.genericFindOne('lieus',
			{ 'lieu': nouveauLieu.lieu },
			function (err, lieu) {
				if (lieu != null)
					res.status(500).send({ err: "lieu '" + nouveauLieu.lieu + "' déjà existant" });
				else {
					nouveauLieu._id = nouveauLieu.lieu;
					// 2 - verification qu'il y a bien des stations pou l'adresse GPS
					AppelApi(parfunc=api_tan.GenericAsync(api_tan.getTanStations(latitude,longitude)),
					function(par) {
						lstLieus = par;
						// console.log('liste lieux trouvés : ' + lstLieus);
						if (lstLieus === undefined) {
							res.status(500).send({ err: 'Aucune station pour cette adresse' });
						}
						else {
							nouveauLieu.lstStations = lstLieus;
							// 3 - Insertions en base
							myGenericMongoClient.genericInsertOne('lieus',
							nouveauLieu,
							function (err, eId) {
								if (err == null && eId != null)
									res.send(nouveauLieu);
								else
									res.status(500).send({
										err: "cannot insert in database",
										cause: err
									});
							});

						}
					})

				}
			});
			
	

		

	
	});

// http://localhost:8282/transport-nantes-api/private/role-admin/lieu en mode PUT
// avec { "code" : "USD" , "nom" : "Dollar" , "change" : 1.123 } dans req.body
apiRouter.route('/transport-nantes-api/private/role-admin/lieu')
	.put(function (req, res, next) {
		var newValueOflieuToUpdate = req.body;
		console.log("PUT,newValueOflieuToUpdate=" + JSON.stringify(newValueOflieuToUpdate));
		myGenericMongoClient.genericUpdateOne('lieus',
			newValueOflieuToUpdate.code,
			{
				nom: newValueOflieuToUpdate.nom,
				change: newValueOflieuToUpdate.change
			},
			function (err, lieu) {
				if (err) {
					res.status(404).json({ err: "no lieu to update with code=" + newValueOflieuToUpdate.code });
				} else {
					res.send(newValueOflieuToUpdate);
				}
			});	//end of genericUpdateOne()
	});

// http://localhost:8282/transport-nantes-api/private/role-admin/lieu/COMM en mode DELETE
apiRouter.route('/transport-nantes-api/private/role-admin/lieu/:code')
	.delete(function (req, res, next) {
		var codelieu = req.params.code
		console.log("DELETE,lieu=" + codelieu);
		let query = { "lieu" : req.params.code}
		// myGenericMongoClient.genericDeleteOneById('lieus', codelieu,
		myGenericMongoClient.genericRemove('lieus',query,
			function (err, isDeleted) {
				console.log("resultat sur delete lieu : " + codelieu + " : " + isDeleted);
				if (!isDeleted)
					res.status(404).send({ err: "not found , no delete" });
				else
					res.send({ deletedlieuCode: codelieu });
			});
	});

// http://localhost:8282/getLstEnvParms en mode Get ou
// http://localhost:8282/getLstEnvParms?param=val en mode Get
apiRouter.route('/GetLstEnvParms')
	.get(function (req, res, next) { 
		let Param = req.query.param;
		let password = req.query.password;
		if (password !== "jyeWxqRuQH9CcK7XAPY36*Jz8r%EGVb4vSahgn$F5sTLZwdBkt") {
			res.status(404).json({ err: "no access to this api"});
			console.log("password en param : " + password);
			return;
		}
		console.log("GET,parms:" + Param);
		let lstParms = api_tan.getAllEnvParms(Param);
		if (Param !== undefined) {
			if (lstParms[Param] === undefined) {
				res.status(404).send({ err: "parametre '" + Param + "' non trouvé"});
				return;
			}
		}
		res.send(lstParms);
	});

// Recuperation liste des favoris utilisateurs
//exemple URL: http://localhost:8282/transport-nantes-api/public/favoris?email=&station=..
//  (retoune les horaires prévus)
apiRouter.route('/transport-nantes-api/public/favoris')
	.get(function (req, res, next) {
		var Codestation = req.query.station;
		var email  = req.query.email;
		let querytest = {};
		if (Codestation !== undefined) {
			querytest["station"] = Codestation;
		}
		if (email !== undefined) {
			querytest["email"] = email;
		}

		console.log("GET,favoris,Query:" + JSON.stringify(querytest));
		// Recherche infos dans MongoDB
		myGenericMongoClient.genericFindList('favoris',querytest,
			function (err, favoris) {
				if (favoris == null || favoris == "")
					res.status(404).send({ err: "favoris non trouvé" });
				else
					res.send(favoris);
		})
		;//end of getfavoris
	});

// Suppression, liste des favoris utilisateurs
//exemple URL: http://localhost:8282/transport-nantes-api/public/favoris?email=&station=..
apiRouter.route('/transport-nantes-api/public/favoris')
.delete(function (req, res, next) {
	var Codestation = req.query.station;
	var email  = req.query.email;
	let querytest = {};
	if (Codestation !== undefined) {
		querytest["station"] = Codestation;
	}
	if (email !== undefined) {
		querytest["email"] = email;
	}

	console.log("Delete,favoris,Query:" + JSON.stringify(querytest));
	// delete infos dans MongoDB
	myGenericMongoClient.genericRemove('favoris',querytest,
	function (err, isDeleted) {
		console.log("resultat sur delete favoris : " + JSON.stringify(querytest) + " : " + isDeleted);
		if (!isDeleted)
			res.status(404).send({ err: "favoris not found , no delete" });
		else
			res.send({ deletedlieuCode: JSON.stringify(querytest) });
	});
	;//end of dlete
});

// Ajout,ajout favoris en base
//exemple URL: http://localhost:8282/transport-nantes-api/public/favoris?email=&station=..
// Add a favoris avec parametres passé
apiRouter.route('/transport-nantes-api/public/favoris')
.post(function (req, res, next) {
	var Codestation = req.query.station;
	var email  = req.query.email;
	let querytest = {};
	if (Codestation !== undefined) {
		querytest["station"] = Codestation;
	} else {
		res.status(500).send({ err: 'Code Station non communiqué !' });
		return;
	}
	if (email !== undefined) {
		querytest["email"] = email;
	} else {
		res.status(500).send({ err: 'Email non communiqué !' });
		return;
	}

	if (email !== undefined) {
		querytest["email"] = email;
	} else {
		res.status(500).send({ err: 'Email non communiqué !' });
		return;
	}

	console.log("Insert,favoris,Query:" + JSON.stringify(querytest));
	// 1 - verification que le favoris n'existe pas en MongoDB

	myGenericMongoClient.genericFindOne('favoris',
	querytest,
	function (err, lieu) {
		if (lieu != null) {
			res.status(500).send({ err: "favoris " + JSON.stringify(querytest) + " déjà existant" });
		} else {
			let favori = querytest;
			let datCur = Date();
			favori["date"] = datCur.toString();
			// 2 - Insertions en base
			myGenericMongoClient.genericInsertOne('favoris',
			favori,
			function (err, eId) {
				if (err == null && eId != null)
					res.send(favori);
				else
					res.status(500).send({
						err: "cannot insert in database",
						cause: err
					});
			});
		}
		});
});
		
exports.apiRouter = apiRouter;