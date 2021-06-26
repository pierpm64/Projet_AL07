// test radio api (rapidapi.com) - now playing
var unirest = require("unirest");
// var Hjson=require("hjson");

var req = unirest("GET", "https://30-000-radio-stations-and-music-charts.p.rapidapi.com/rapidapi");

req.query({
	"charts24h": "1"
});

req.headers({
	"x-rapidapi-key": "57c81ee3c0msh369e244b21974e2p123097jsn0c09887d3410",
	"x-rapidapi-host": "30-000-radio-stations-and-music-charts.p.rapidapi.com",
	"useQueryString": true
});

// get current date
const curDate = new Date();
const curDatStr = curDate.toISOString();
console.log("curDate : " + curDate + " / curDatStr : " + curDatStr);

req.end(function (res) {
	if (res.error) throw new Error(res.error);

    var ObjResult = res.body;
	// console.log(ObjResult);
    // var radioTest = '{title_song: "Mr roboto","artist_song": "Styx",' +
    // '"radio_name": "Radio K4", date: "2021-06-07 18:14:04"}'
    // var lstSongs = Hjson.parse(radioTest);
    // var lstSongFull = Hjson.parse(ObjResult);
    console.log("type of ObjResult : " + typeof ObjResult)
    // console.log("test ObjResult : " + ObjResult.results)
    let i = 0;
   for (let song of ObjResult.results) {
        i++;
        song.dateTime = curDatStr;
        console.log("N° " + i + "/ infos :" +  JSON.stringify(song));
    }
    // console.log("date de chansons : " + lstSongs.date);
    //for (result in lstSongs) {
    //    console.log(result.results)
    // }
});