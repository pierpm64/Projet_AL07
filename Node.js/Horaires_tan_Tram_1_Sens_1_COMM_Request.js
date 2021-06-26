// appel api tan avec request

const request = require('request');

request('http://open_preprod.tan.fr/ewp/horairesarret.json/COMM/2/1', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }

  // console.log("body : " + JSON.stringify(body));
  // console.log("lstHoraires : " + JSON.stringify(lstHoraires));
  /* for (let valpar  in lstHoraires) {
    let detvalpar = lstHoraires[valpar];
    if (typeof detvalpar == "object") {
      for (let valpardet  in detvalpar) {
        let detLev2Par = detvalpar[valpardet]
        console.log(valpar +  " - " + valpardet + " : " + detLev2Par + " / type : " + typeof detLev2Par);
      }
    } else {
      console.log(valpar + " : " + detvalpar + " / type : " + typeof detvalpar);
    }
}
*/
let lstHoraires = res.body;
  console.log("Ligne : " + lstHoraires.ligne.numLigne + " / sens 1 : " + lstHoraires.ligne.directionSens1 + 
  " / sens 2 : " + lstHoraires.ligne.directionSens2)
  console.log("arret : " + lstHoraires.arret.codeArret + " / " + lstHoraires.arret.libelle )


  let detPlannedTime = new Map();

  let detHoraires = lstHoraires["horaires"];
  // console.log("detail horaires : " + detHoraires)
  if (detHoraires !== undefined) {
    
    for  (horaire of detHoraires) {
      let plannedHeure = horaire.heure.padStart(3,'0').substr(0,2);
      let lstMinutes = [];
      // let lstMinutes = horaire.passages;
    //  console.log("Heure :" + horaire.heure + " / minutes " + horaire.passages + " / taille : " + horaire.passages.length); 
      for (detMinute of horaire.passages) {
        console.log("===> " + plannedHeure + ":" + detMinute.substr(0,2))
        lstMinutes.push(plannedHeure + ":" + detMinute.substr(0,2));
      }
      detPlannedTime[plannedHeure] =  lstMinutes;
    //  " / terminus : " + trajet.terminus + " / temps : " +  trajet.temps )
    }
    // let nextHoraires = lstHoraires["prochainsHoraires"];
    // if (nextHoraires !== undefined) {
    //  console.log("prochains horaires : ")
    //  for  (horaire of nextHoraires) {
    //    console.log("Heure :" + horaire.heure + " / minutes " + horaire.passages + " / taille : " + horaire.passages.length); 
    //  }
    // }
  } else {
    console.log("aucun horaire pour cette ligne !")
  }
  let infoHoraires = {
    "ligne" : lstHoraires.ligne.numLigne ,
    "sens1" :  lstHoraires.ligne.directionSens1 ,
    "sens2" :  lstHoraires.ligne.directionSens2 ,
    "horaires" : detPlannedTime
  }
  console.log("infoHoraires : " + JSON.stringify(infoHoraires))
});