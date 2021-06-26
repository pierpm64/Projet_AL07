// test connect mongodb 
const {MongoClient} = require('mongodb');
var unirest = require("unirest");

// Déclaration pour appel api recherche "Daily Chart" radios

var req = unirest("GET", "https://30-000-radio-stations-and-music-charts.p.rapidapi.com/rapidapi");

req.query({
    "charts24h": "1"
});

req.headers({
	"x-rapidapi-key": "57c81ee3c0msh369e244b21974e2p123097jsn0c09887d3410",
	"x-rapidapi-host": "30-000-radio-stations-and-music-charts.p.rapidapi.com",
	"useQueryString": true
});

// Déclaration uri connexion MongoDB

const uri = "mongodb://localhost:27017"

// get current date
const curDate = new Date();
const curDatStr = curDate.toISOString();
console.log("curDate : " + curDate + " / curDatStr : " + curDatStr);

// function d'insert de données provenant api
async function InsertData(data){
    const client2 = new MongoClient(uri, { 
        useUnifiedTopology: true,
        useNewUrlParser: true,
        connectTimeoutMS: 30000,
        keepAlive: 1
    });

    try {
        await client2.connect();    
        await client2.db("Radios").collection("dailyChart").insertOne(data);
    } catch (e) {
        console.error(e);
    } finally {
         await client2.close();
    }
};

// fontion d'appel de l'api et exploitation résultats
async function main(){
    
    req.end(function (res) {
        if (res.error) throw new Error(res.error);

        var ObjResult = res.body;
        // console.log(ObjResult);
        
        let i = 0;
        for (let title of ObjResult.results) {
            i++;
            title.dateTime = curDatStr;
            console.log("N° " + i + "/ infos :" +  JSON.stringify(title));
    
            InsertData(title);
        }
                
    }); 
}

// routine principale

main();