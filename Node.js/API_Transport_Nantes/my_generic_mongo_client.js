// myGenericMongoClient module (with MongoDB/MongoClient)
// Utilisé dans le cadre du projet AL07 - Transport Nantes

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
const api_tan  = require('./api_tan_v1');
var assert = require('assert');

var mongoDbUrl = api_tan.getEnvParam('MongoUri','mongodb://localhost:27017');
var dbName = api_tan.getEnvParam('MongoDb','tranport_nantes' );
var currentDb=null; //current MongoDB connection
console.log("MongoUri : " + mongoDbUrl + " / MongoDb : " + dbName);

var setMongoDbUrl = function(dbUrl){
	mongoDbUrl = dbUrl;
}

var setMongoDbName = function(mongoDbName){
	dbName = mongoDbName;
}

var closeCurrentMongoDBConnection = function(){
	currentDb.close();
	currentDb=null;
}

var executeInMongoDbConnection = function(callback_with_db) {
  if(currentDb==null){
    MongoClient.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true },	function(err, db) {
	if(err!=null) {
		console.log("mongoDb connection error = " + err + " for dbUrl=" + mongoDbUrl );
	}
	assert.equal(null, err);
	console.log("Connected correctly to mongodb database" );
	//currentDb = db; //with mongodb client v2.x
	currentDb = db.db(dbName);//with mongodb client >= v3.x
	callback_with_db(currentDb);
	});
  }else{
	callback_with_db(currentDb);  
  }
}

var genericUpdateOne = function(collectionName,id,changes,callback_with_err_and_results) {
	executeInMongoDbConnection( function(db) {
		db.collection(collectionName).updateOne( { '_id' : id }, { $set : changes } ,
			function(err, results) {
			   //console.log("updateOne results="+JSON.stringify(results));
				if(err!=null) {
					console.log("genericUpdateOne error = " + err);
				}else{
					if(results.matchedCount == 0)
					  err = "no existing object with this id was found , no update"
				}
			callback_with_err_and_results(err,results);
			});
		});
};

var genericInsertOne = function(collectionName,newOne,callback_with_err_and_newId) {
	executeInMongoDbConnection( function(db) {
 db.collection(collectionName).insertOne( newOne , function(err, result) {
		if(err!=null) {
			console.log("genericInsertOne error = " + err);
			newId=null;
		}
		else {newId=newOne._id;
		}
		callback_with_err_and_newId(err,newId);
		});
	});
};

var genericFindList = function(collectionName,query,callback_with_err_and_array) {
	executeInMongoDbConnection( function(db) {
		var cursor = db.collection(collectionName).find(query);
		cursor.toArray(function(err, arr) {
			callback_with_err_and_array(err,arr);
		});
   });
};

var genericRemove = function(collectionName,query,callback_with_err_and_result) {
	executeInMongoDbConnection( function(db) {
		db.collection(collectionName).deleteOne(query ,function(err, obj) {
			if(err) {
				console.log("genericRemove error = " + err);
			}
			//if (err) throw err;
			let resdel = true;
			if (obj.deletedCount < 1) {
				resdel = false;
			}
			//console.log(obj.result.n + " document(s) deleted / details : " + JSON.stringify(obj) +
			//						 " / resdel : " + resdel );
			callback_with_err_and_result(err,resdel);
		});
   });
};

var genericDelAll = function(collectionName,query,callback_with_err_and_result) {
	executeInMongoDbConnection( function(db) {
		db.collection(collectionName).deletMany(query ,function(err, obj) {
			if(err) {
				console.log("genericRemove error = " + err);
			}
			//if (err) throw err;
			let resdel = true;
			if (obj.deletedCount < 1) {
				resdel = false;
			}
			callback_with_err_and_result(err,resdel);
		});
   });
};

var genericDeleteOneById = function(collectionName,mongoIdAsString,callback_with_err_and_booleanResult) {
	executeInMongoDbConnection( function(db) {
		db.collection(collectionName).deleteOne( { '_id' : /*new ObjectID(*/mongoIdAsString } , function(err,deleteWriteOpResultObject) {
		if(deleteWriteOpResultObject.deletedCount!=1) {
			console.log("genericDeleteOneById --> no delete");
			callback_with_err_and_booleanResult("no delete",false);
			}
		else {
			console.log(" 1 document deleted");
			callback_with_err_and_booleanResult(null,true);
		  }
		});
   });
};

var genericFindOne = function(collectionName,query, callback_with_err_and_item) {
	executeInMongoDbConnection( function(db) {
		db.collection(collectionName).findOne(query , function(err, item) {
			if(err!=null) {
				console.log("genericFindById error = " + err);
		}
		//assert.equal(null, err);
		callback_with_err_and_item(err,item);
		});
    });
};

exports.genericUpdateOne = genericUpdateOne;
exports.genericInsertOne = genericInsertOne;
exports.genericFindList = genericFindList;
exports.genericFindOne = genericFindOne;
exports.genericRemove = genericRemove;
exports.genericDeleteOneById = genericDeleteOneById;
exports.genericDelAll = genericDelAll;
exports.setMongoDbUrl = setMongoDbUrl;
exports.setMongoDbName =setMongoDbName;
exports.executeInMongoDbConnection = executeInMongoDbConnection;
exports.closeCurrentMongoDBConnection = closeCurrentMongoDBConnection;