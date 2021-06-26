// module principal de l'api de qualité des transports communs à Nantes
// Projet fin de cycle AL07 - Juillet 2021
// by PierPM
var express = require('express');
const apiRouter = express.Router();

var myGenericMongoClient = require('./my_generic_mongo_client');

//exemple URL: http://localhost:8282/transport-nantes-api/public/lieu/Bourse
apiRouter.route('/transport-nantes-api/public/lieu/:code')
	.get(function (req, res, next) {
		var codeLieu = req.params.code;
		myGenericMongoClient.genericFindOne('lieu',
			{ 'lieu': codeLieu },
			function (err, lieu) {
				if (lieu == null)
					res.status(404).send({ err: 'lieu non trouvé' });
				else
					res.send(lieu);
			});

	});

//exemple URL: http://localhost:8282/transport-nantes-api/public/lieu (retoune tous les lieux )
apiRouter.route('/transport-nantes-api/public/lieu')
	.get(function (req, res, next) 
		myGenericMongoClient.genericFindList('lieus', function (err, lieux) {
			res.send(lieux);
		});//end of genericFindList()
	});

// http://localhost:8282/transport-nantes-api/private/role-admin/lieu en mode post
// avec { "lieu" : "libel court" , "nom" : "libel long" , description : "description long", lattitude" : 123, longitude : 123 } 
// dans req.body
apiRouter.route('/transport-nantes-api/private/role-admin/lieu')
	.post(function (req, res, next) {
		var nouveauLieu = req.body;
		console.log("POST,nouveauLieu=" + JSON.stringify(nouveauLieu));
		
		// 1 - verification que le lieu n'existe pas en MongoDB
		myGenericMongoClient.genericFindOne('lieu',
			{ 'lieu': nouveauLieu.lieu },
			function (err, lieu) {
				if (lieu != null)
					res.status(500).send({ err: 'lieu déjà existant' });
			});
			
		
		// 


		//nouveauLieu._id=nouveauLieu.code;
		myGenericMongoClient.genericInsertOne('lieus',
			nouveauLieuPourMongoAvecId,
			function (err, eId) {
				if (err == null && eId != null)
					res.send(nouveauLieu);
				else
					res.status(500).send({
						err: "cannot insert in database",
						cause: err
					});
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

// http://localhost:8282/transport-nantes-api/private/role-admin/lieu/EUR en mode DELETE
apiRouter.route('/transport-nantes-api/private/role-admin/lieu/:code')
	.delete(function (req, res, next) {
		var codelieu = req.params.code;
		console.log("DELETE,codelieu=" + codelieu);
		myGenericMongoClient.genericDeleteOneById('lieus', codelieu,
			function (err, isDeleted) {
				if (!isDeleted)
					res.status(404).send({ err: "not found , no delete" });
				else
					res.send({ deletedlieuCode: codelieu });
			});
	});

exports.apiRouter = apiRouter;