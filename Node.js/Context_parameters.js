// get parameters from environnement
// to use with AWS, GitLab/CI, Heroku (parameters) 
var env = process.env;
console.log("path : " + env.path );
console.log("ensemble des parametres : " + JSON.stringify(env));
for (let valpar  in env) {
    console.log(valpar + " : " + env[valpar]);
}
let parDummy = env.tmp;
console.log("dummy parameter : " + env["dummy"] + " / " + env.dummy + " / " + typeof parDummy);
console.log("test getEnvParam " + getEnvParam("WINDIR","myval"));

// recupere une variable d'environnement dans le contexte , et si non trouve, prend la valeur par defaut
function getEnvParam(param,defaut=undefined) {
	var env = process.env;
	var value = env[param];
	if (value === undefined) {
		return defaut;
	} else {
		return value;
	}	
}