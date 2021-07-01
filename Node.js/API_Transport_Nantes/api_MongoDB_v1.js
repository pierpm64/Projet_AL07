// Module d'appel des apis MongoDB
// Doc complète API sur :https://docs.mongodb.com/drivers/node/current/
// Projet AL07 - Juillet 2021
// By PierPM

const api_tan  = require('./api_tan_v1');
const {MongoClient} = require('mongodb');
const MongoUri = api_tan.getEnvParam('MongoUri','mongodb://localhost:27017');
const MongoDb = api_tan.getEnvParam('MongoDb','tranport_nantes');
console.log("MongoUri : " + MongoUri + " / MongoDb : " + MongoDb);

// function de Save de données dans MongoDB
async function MongoSaveData(data,collection="TanAllStations"){
    const client = new MongoClient(MongoUri, { 
        useUnifiedTopology: true,
        useNewUrlParser: true,
        connectTimeoutMS: 30000,
        keepAlive: 1
    }); 

    try {
        await client.connect();    
        /* // Delete eventuel before insert
        if (data._id !== undefined) {
            const query = {_id: data._id}
            await client.db(MongoDb).collection(collection).deleteOne(query)
        }*/
        // Insert data
        await client.db(MongoDb).collection(collection).insertOne(data);
    } catch (e) {
        console.error(e);
    } finally {
         await client.close();
    }
};

// function de Delete de données dans MongoDB
async function MongoDeleteData(query={},collection="TanAllStations"){
    const client = new MongoClient(MongoUri, { 
        useUnifiedTopology: true,
        useNewUrlParser: true,
        connectTimeoutMS: 30000,
        keepAlive: 1
    }); 

    try {
        await client.connect();    
        await client.db(MongoDb).collection(collection)
        // Delete data based on query before insert
        await client.db(MongoDb).collection(collection).deleteMany(query)
    } catch (e) {
        console.error(e);
    } finally {
         await client.close();
    }
};

// function de Delete de Collection dans MongoDB
async function MongoDeleteCollection(collection="TanAllStations"){
    const client = new MongoClient(MongoUri, { 
        useUnifiedTopology: true,
        useNewUrlParser: true,
        connectTimeoutMS: 30000,
        keepAlive: 1
    }); 

    try {
        await client.connect();    
        // Delete data based on query before insert
        await client.db(MongoDb).collection(collection).drop()
    } catch (e) {
        console.error(e);
    } finally {
         await client.close();
    }
};

// Export functions
exports.MongoSaveData = MongoSaveData;
exports.MongoDeleteData = MongoDeleteData;
exports.MongoDeleteCollection = MongoDeleteCollection;