// Module "scheduler" pour lancer le robot quand besoin
// Doc complète Scheduler sur :https://www.npmjs.com/package/node-schedule
// Projet AL07 - Juillet 2021
// By PierPM
const schedule = require('node-schedule');
const os  = require('os');
const api_tan  = require('./api_tan_v1');
const robot = require('./Robot_tan_v1');

// Job Quotidien (tous les jours à 5h15)
const jobQuotiden = schedule.scheduleJob('15 5 */1 * *', function(){
    robot.mainTask('day');
  });

// Job Horaire (toutes les heures, minute 0)
const jobNow = schedule.scheduleJob('0 */1 * * *', function(){
    robot.mainTask('now');
  });

// Job Hebdo (tous les samedi à 12h30)
const jobWeek = schedule.scheduleJob('30 12 * * 6', function(){
    robot.mainTask('init');
  });

// main
let plateform = process.platform;
let osversion = os.version();
let osHost = os.hostname();

console.log("Scheduler Robot pour appli fiabilité TAN le " + api_tan.getCurDateTime() + 
 " / plateforme : " + plateform + " / os : " + osversion + 
" / host : " + osHost); 

let envpar = api_tan.getAllEnvParms() 
console.log("parametres d'environnement : ")
for (par in envpar) {
    console.log(" ==> " + par + " = " + envpar[par]);
}