// appel api tan avec request

const request = require('request');
const addMinutes = require('date-fns/addMinutes');
const addSeconds = require('date-fns/addSeconds');

var lstTypesLignes = ["null","Tramway","Busway","Bus","Navibus"];
var station = "COMM";

let urlRequest = 'http://open_preprod.tan.fr/ewp/tempsattente.json/' + station;
urlRequest = 'http://open.tan.fr/ewp/tempsattente.json/' + station;

request(urlRequest, { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  let lstTrajets = res.body;

  let datCurR = new Date();
  let datCur = addSeconds(datCurR,30)
  // formatage date heure courante
  let datCurForm = datCur.getFullYear() + datCur.getMonth().toString().padStart(2,"0") +
                datCur.getDate().toString().padStart(2,"0") 
  let timeCurForm = datCur.getHours().toString().padStart(2,"0") + 
                datCur.getMinutes().toString().padStart(2,"0") + datCur.getSeconds().toString().padStart(2,"0") + 
                "." + datCur.getMilliseconds().toString().padStart(3,"0")
  console.log("Date/heure courante : " + datCurR + " / +30s : " + datCur +
           " / form : " + datCurForm + "." + timeCurForm);
  let detLignes = new Map();
  for  (trajet of lstTrajets) {

    // Calcul heure de passage par rapport à heure courante + délai
    let tempTrajet = trajet.temps;
     if (tempTrajet == "Proche") {
      tempTrajet = 0;
    } else {
      tempTrajet = tempTrajet.split(' ')[0]
      if (isNaN(tempTrajet)) {
        continue;
      }
      tempTrajet = Number(tempTrajet);
    }
    let dateTrajet = addMinutes(datCur,tempTrajet);
    let timeTrajet = dateTrajet.getHours().toString().padStart(2,"0") + ':' +
     dateTrajet.getMinutes().toString().padStart(2,"0") 

    // recherche ligne dans la "map" des horaires 
    let lstPassages = [];
    let clef = trajet.ligne.numLigne + "_" + trajet.sens;
    let lstHoraires = detLignes.get(clef);
    if (lstHoraires === undefined) {
      lstHoraires = {
        "ligne" : trajet.ligne.numLigne , 
        "sens" : trajet.sens ,
        "codeType" : trajet.ligne.typeLigne,
        "libelType" : lstTypesLignes[trajet.ligne.typeLigne],
        "terminus" : trajet.terminus,
        "horaires" : lstPassages
      }  
      detLignes.set(clef,lstHoraires);
    } else {
      lstPassages = lstHoraires["horaires"];
    }



    /* console.log("Ligne :" + trajet.ligne.numLigne + " / sens : " + trajet.sens + 
    " / type : " + trajet.ligne.typeLigne +"=" + lstTypesLignes[trajet.ligne.typeLigne] + 
    " / terminus : " + trajet.terminus + " / temps : " +  trajet.temps + "/" + tempTrajet +
     " / date_heure " + dateTrajet + " / heure : " + timeTrajet) */

    // Mise à jour du trajet en Map
    lstPassages.push(timeTrajet);
    lstHoraires["horaires"] = lstPassages
    detLignes.set(clef,lstHoraires);

    //console.log("clef : " + clef + " / LstHoraires : " + JSON.stringify(lstHoraires) +
    // " / lstpassages : " + lstPassages);


  }

  // formatage Map en liste d'object pour "export" en JSON
  let lstTimes = []; 
  for  (ligne of detLignes) {
    let objTime = {
      "LigneSens" : ligne[0],
      "details" : ligne[1]
    }
    lstTimes.push(objTime);
  }

  let objTimeAll = {
    "lieu" : station,
    "time2" : timeCurForm.substr(0,2),
    "date" : datCurForm,
    "timef" : timeCurForm,
    "horaires" : lstTimes
  }

  // console.log(JSON.stringify(lstTimes));
  console.log(objTimeAll);

});