// test api tan 
const api_tan  = require('./api_tan_v1');
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
// realTime();plannedTime();Stations();
Stations(47.2133057,-1.5604042);
realTime();