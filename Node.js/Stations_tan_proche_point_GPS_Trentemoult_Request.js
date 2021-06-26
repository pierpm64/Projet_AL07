// appel api tan avec request

const request = require('request');
console.log("rentée dans script le : "+ Date.now())

request('http://open_preprod.tan.fr/ewp/arrets.json/47,1941706/-1,5845667', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  let lstStations = res.body;
  console.log("lstStation JSON : " + lstStations);

  for  (station of lstStations) {
    console.log("station / Lieu :" + station.codeLieu  + " / Libellé : " + station.libelle + 
    " / distance : " +  station.distance)
    for (ligne of station.ligne) {
      console.log("===> ligne : " + ligne.numLigne)
    }
  }

});