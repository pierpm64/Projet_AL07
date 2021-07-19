// Module "Robot" pour collecter infos au jour et de l'heure
// Doc complète MongoDB sur :https://docs.mongodb.com/drivers/node/current/
// Projet AL07 - Juillet 2021
// By PierPM

const os  = require('os');
const api_tan  = require('./api_tan_v1');
const api_mongoDB = require('./my_generic_mongo_client');
const api_mongoDB_v1 = require('./api_MongoDB_v1');
const subDays = require('date-fns/subDays')


// Async function to call TAN API
async function AppelApi(parfunc=api_tan.GenericAsync(api_tan.getTanStations(47.2133057,-1.5604042)),
retour=function(par){console.log("demo :" + JSON.stringify(par))}) {
    let demo = await parfunc 
    retour(demo);
    // console.log("demo : " + JSON.stringify(demo));
}

// function de recherche des horaires planifiés pour tous les lieux, stations et lignes associées
function getPlannedTime(curDate) { 
         console.log('getPlannedTime - Début recherche horaires planifiés pour le  : ' + curDate + 
                     " / run le : "  + api_tan.getCurDateTime() )

        //  recherche dans MongoDB l'ensemble des lieux 
        api_mongoDB.genericFindList("lieus",{},
        function (err, lieus) {
            // console.log(JSON.stringify(lieus));
            let lstStation = {};
            for (lieu of lieus) {
                    for (station of lieu.lstStations) {
                    if (lstStation[station.lieu] === undefined) {
                        lstStation[station.lieu] = 1;
                    }
                    else {
                        lstStation[station.lieu]++;
                    }
                }
            }

            console.log('getPlannedTime - liste des stations analysées : ' + lstStation + 
            " / le : "  + api_tan.getCurDateTime() )

            for (let station in lstStation) {
                // console.log("station :" + station);
                    api_mongoDB.genericFindList("TanAllStations",{_id : station},
                    function (err, lieus2) {
                        // console.log("get All Stations pour lieu : " + station + " : " + JSON.stringify(lieus2));
                        let nblignes = 0;
                        for (lieu of lieus2) {
                            nblignes++;
                            let codelieu = lieu.lieu;
                            for (ligne of lieu.lignes) {
                                // console.log("Lieu : " + codelieu + " / ligne : " + ligne)

                                // 2 - Appel api pour avoir les horaires aller (avec delete)
                                AppelApi(api_tan.GenericAsync(api_tan.getTanPlannedTime(codelieu,ligne,1)),
                                function(par) {
                                    let lsthoraires = par;
                                    // console.log('liste lieux trouvés : ' + lstLieus);
                                    if (lsthoraires !== undefined) {
                                        lsthoraires.date = curDate;
                                        lsthoraires.timeStamp = api_tan.getCurDateTime();
                                        // console.log("horaire à creer in MongoDB - TanPlannedTime - " +
                                        //" lieu : " + lsthoraires.lieu + " / ligne : " + lsthoraires.ligne +
                                        // " / sens : " + lsthoraires.sens + " - at : " + api_tan.getCurDateTime())
                                        api_mongoDB.genericInsertOne('TanPlannedTime',
                                        lsthoraires,
                                        function (err, eId) {
                                            if (err == null && eId != null)
                                                console.log("horaire créé in MongoDB - TanPlannedTime - " +
                                                " lieu : " + lsthoraires.lieu + " / ligne : " + lsthoraires.ligne +
                                                " / sens : " + lsthoraires.sens + " / at : " + api_tan.getCurDateTime())
                                            else
                                                console.log("erreur insert in MongoDB - TanPlannedTime " +
                                                "- erreur :" + err)
                                        });
                                     
                                    }
                                })

                                 // 2 - Appel api pour avoir les horaires retour
                                 AppelApi(api_tan.GenericAsync(api_tan.getTanPlannedTime(codelieu,ligne,2)),
                                 function(par) {
                                     let lsthoraires = par;
                                     // console.log('liste lieux trouvés : ' + lstLieus);
                                     if (lsthoraires !== undefined) {
                                        lsthoraires.date = curDate;
                                        lsthoraires.timeStamp = api_tan.getCurDateTime();
                                        //console.log("horaire à creer in MongoDB - TanPlannedTime - " +
                                        //" lieu : " + lsthoraires.lieu + " / ligne : " + lsthoraires.ligne +
                                        // " / sens : " + lsthoraires.sens + " - at : " + api_tan.getCurDateTime())
                                        api_mongoDB.genericInsertOne('TanPlannedTime',
                                            lsthoraires,
                                            function (err, eId) {
                                                if (err == null && eId != null)
                                                    console.log("horaire créé in MongoDB - TanPlannedTime - " +
                                                    " lieu : " + lsthoraires.lieu + " / ligne : " + lsthoraires.ligne +
                                                    " / sens : " + lsthoraires.sens + " / at : " + api_tan.getCurDateTime())
                                                else
                                                    console.log("erreur insert in MongoDB - TanPlannedTime " +
                                                    "- erreur :" + err)
                                            });
                                      
                                     }
                                 })
                            }   
                        }
                        if (nblignes == 0) {
                            console.log("getPlannedTime - pas de ligne trouvée pour la station : " + station); 
                        }
                    });
            }


        });
    }


// function de recherche des horaires planifiés pour tous les lieux, stations et lignes associées
function getRealTime(curDate,curHeure) { 
    console.log("==> appel getRealTime ( date:" + curDate + ", heure:" + 
    curHeure + " ) le " + api_tan.getCurDateTime())
    api_mongoDB.genericFindList("lieus",{},
    function (err, lieus) 
    {
        let lstStation = {};
        // console.log("==> getRealTime /  liste des lieus à analyser : " + JSON.stringify(lieus));
        for (lieu of lieus) {
                for (station of lieu.lstStations) {
                if (lstStation[station.lieu] === undefined) {
                    lstStation[station.lieu] = 1;
                }
                else {
                    lstStation[station.lieu]++;
                }
            }
        }

        console.log("==> getRealTime /  liste des station à analyser " + JSON.stringify(lstStation));
        for (let station in lstStation) {
            // console.log("station :" + station);
               
            // Appel api pour avoir les horaires reels
            // console.log("appel api_tan.getTanRealTime("+ station + ") le " + api_tan.getCurDateTime())
            AppelApi(api_tan.GenericAsync(api_tan.getTanRealTime(station)),
                    function(par) 
                    {
                        let lsthoraires = par;
                        // console.log('liste lieux trouvés : ' + lstLieus);
                        // Reformatage output appel api pour insert MongoDB
                        if (lsthoraires !== undefined) {
                            let dethoraires = lsthoraires.horaires;
                            if (dethoraires !== undefined) {
                                for (horaire of dethoraires) {
                                    let dethoraireligne = horaire.details;
                                    let objRealTime = {
                                        date : curDate,
                                        heure : curHeure,
                                        timeStamp : api_tan.getCurDateTime(),
                                        lieu : lsthoraires.lieu,
                                        ligne : dethoraireligne.ligne,
                                        sens : dethoraireligne.sens,
                                        realtime : dethoraireligne.realTime,
                                        libtype : dethoraireligne.libeType,
                                        horaires :  dethoraireligne.horaires
                                    }
                                    // Insert
                                    api_mongoDB.genericInsertOne('TanRealTime',objRealTime,
                                    function (err, eId) {
                                        if (err == null && eId != null)
                                            console.log("horaire créé in MongoDB - TanRealTime - " + 
                                                "lieu : " + objRealTime.lieu + " / ligne : " + objRealTime.ligne +
                                                " / sens : " + objRealTime.sens +
                                                " / at : " + api_tan.getCurDateTime());
                                        else
                                            console.log("erreur insert in MongoDB - TanRealTime " +
                                            "- erreur :" + err)
                                        });
                                            
                                        }
                                    }
                        }   
                    });
                
        }


    });
}

// function get and update all stations
async function getallStations() {
    // delete MongoDB collection tanAllStations
    await api_mongoDB_v1.MongoDeleteCollection("TanAllStations");
    // appel api get station et exploitation resultats
    lstStations  = await api_tan.getAllTanStations();
    // Insertion resultat dans MongoDB
    for (let station of lstStations) {
        station._id = station.lieu;
        station.timestamp = api_tan.getCurDateTime();
        await api_mongoDB_v1.MongoSaveData(station,"TanAllStations");
        console.log("Sation créé in MongoDB - TanAllStations - " +
        "lieu : " +  station.lieu + " / libelle : " + station.libelle + " - at : " + api_tan.getCurDateTime());
    }
}


// le robot peut etre appelé de trois facons :
// 1 - init - creation tanAllStation
// 2 - day (default) - Récupeation horaires jours et stockage dans TanPlannedTime
// 2 - now  - Récupeation horaires now et stockage dans TanRealTime

async function mainTask(parm="day")  {
    let plateform = process.platform;
    let osversion = os.version();
    let osHost = os.hostname();

    console.log("Appel Robot pour appli fiabilité TAN le " + api_tan.getCurDateTime() + 
            " / parm : " + parm);

    let dateNow = new Date();   
    let curDate = "";
    let curMonth = 0;     

    switch (parm) {
        // appel function construction et stockage MongoDB all Stations
        case "init" : 
            await getallStations();
            break;
        // appel function construction et stockage MongoDB horaires temp reel
        case "now" :  
            let heureNum = dateNow.getHours();
            let curHeure = heureNum.toString().padStart(2,"0")
            // si l'heure et inferieur à 5h et pas minuit), on ne fait rien
            if ( heureNum < 5 && heureNum !== 0)  {
                return
            }
            if (heureNum == 0) {
                dateNow = subDays(dateNow,1);
            }
            curMonth = dateNow.getMonth() + 1;
            curDate = dateNow.getFullYear() + '-' + curMonth.toString().padStart(2,"0") +
            '-' + dateNow.getDate().toString().padStart(2,"0") 
            //
            await api_mongoDB_v1.MongoDeleteData({date: curDate, heure : curHeure },'TanRealTime')
            console.log("Robot getRealTime - delete dans TanRealTime pour " +
            "{date : " + curDate+ ", heure : "  + curHeure + '}')
            getRealTime(curDate,curHeure);
            break;
        // appel function construction et stockage MongoDB horaires du jour 
        default : 
            curMonth = dateNow.getMonth() + 1;
            curDate = dateNow.getFullYear() + '-' + curMonth.toString().padStart(2,"0") +
            '-' + dateNow.getDate().toString().padStart(2,"0") 

            console.log("Robot getPlannedTime - delete dans TanplannedTime pour {date : " + curDate+ "}")
            await api_mongoDB_v1.MongoDeleteData({date : curDate },'TanPlannedTime')
            getPlannedTime(curDate);
    }

}

exports.mainTask = mainTask;