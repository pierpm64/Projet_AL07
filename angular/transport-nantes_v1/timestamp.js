var replace = require('replace-in-file');
const moment = require('moment-timezone');
var timeStamp = moment(new Date()).tz('Europe/Paris').format("YYYY/MM/DD à HH:mm:ss");
const options = {

    files: [
        'src/environments/environment.ts',
        'src/environments/environment.prod.ts',
        'src/environments/environment.rect.ts',
        'src/environments/environment.devt.ts',
    ],
    from: /timeStamp: '(.*)'/g,
    to: "timeStamp: '" + timeStamp + "'",
    allowEmptyPaths: false,
};
try {
    let changedFiles = replace.sync(options);   
    if (changedFiles == 0) {
        throw "Please make sure that the file '" + options.files + "' has \"timeStamp: ''\"";
    }
    console.log('Build timestamp is set to: ' + timeStamp);
} catch (error) {
    console.error('Error occurred:', error);
    throw error
}