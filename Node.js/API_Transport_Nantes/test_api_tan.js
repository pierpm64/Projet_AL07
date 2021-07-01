// test api tan + insert mongoDb

const api_tan  = require('./api_tan_v1');
const api_mongoDB = require('./api_MongoDB_v1');

async function realTime(codeLieu="COMM") {
    lstHoraires = await api_tan.getTanRealTime(codeLieu);
    console.log("horaires reel / réponse : " + JSON.stringify(lstHoraires))
}
async function plannedTime(codeLieu="COMM",ligne="2",sens=1) {
    lstHoraires = await api_tan.getTanPlannedTime(codeLieu,ligne,sens);
    console.log("horaires planifiés / réponse : " + JSON.stringify(lstHoraires))
}

async function Stations(lattitude=0,longitude=0) {
    lstStations  = await api_tan.getTanStations(lattitude,longitude);
    console.log("lstStations / réponse : " + JSON.stringify(lstStations))
}

async function allStations() {
    lstStations  = await api_tan.getAllTanStations();
    // Insertion resultat dans MongoDB
    for (let station of lstStations) {
        station._id = station.lieu;
        station.timestamp = api_tan.getCurDateTime();
        await api_mongoDB.MongoSaveData(station);
    }
}
// realTime();plannedTime();Stations();
async function test(parfunc=api_tan.GenericAsync(api_tan.getTanStations(47.2133057,-1.5604042)),
retour=function(par){console.log("demo :" + JSON.stringify(par))}) {
    // let demo = await api_tan.GetLstStations(47.2133057,-1.5604042);
    let demo = await parfunc 
    retour(demo);
    // console.log("demo : " + JSON.stringify(demo));
}
// test();
/*
let lstparm = api_tan.getAllEnvParms("tmp");
console.log("lstparms : " + JSON.stringify(lstparm));
//realTime();
plannedTime();
*/
// delete collection realTime 
api_mongoDB.MongoDeleteCollection("TanRealTime");
// qppel Robot real Time
var myArgs = process.argv.slice(2);

const robot = require('./Robot_tan_v1');
robot.mainTask(myArgs[0]);
    //await robot.mainTask('now');
    //await robot.mainTask('init');

// robot.mainTask('init');

//allStations();
// MongoDeleteData();
// MongoDeleteCollection();
/* let dateNow = new Date();
let curDate = ""
let DateMonth =  dateNow.getMonth() + 1
curDate = dateNow.getFullYear() + '-' + DateMonth.toString().padStart(2,"0") +
'-' + dateNow.getDate().toString().padStart(2,"0") 
console.log('dateNow : ' + dateNow + ' / curDate : ' + curDate) */
// realTime(); 