const http = require('http');

http.get('http://open_preprod.tan.fr/ewp/tempsattente.json/COMM', (resp) => {
  let data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    // console.log(data);
    console.log(JSON.parse(data))
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});