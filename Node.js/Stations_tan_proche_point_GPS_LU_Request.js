// appel api tan avec request

const request = require('request');

var urlRequest = "http://open_preprod.tan.fr/ewp/arrets.json/47,2149724/-1,5506156"
// var urlRequest = "http://open_preprod.tan.fr/ewp/arrets.json/48,2149724/-1,5506156"
request(urlRequest, { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  let lstStations = res.body;
  console.log("lstStations : " + JSON.stringify(lstStations));
  let lstAllLieux = [];
  if (lstStations !== undefined ) {
     for  (station of lstStations) {
         console.log("station / Lieu :" + station.codeLieu  + " / Libellé : " + station.libelle + 
        " / distance : " +  station.distance)
        let lstLignes = [];
         for (ligne of station.ligne) {
          console.log("===> ligne : " + ligne.numLigne)
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
  console.log("lstAllLieux : " + JSON.stringify(lstAllLieux));
});