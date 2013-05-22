var request = require('request');

request({
  url: 'http://localhost:8888/alpha2/neatline/records',
  method: 'POST',
  body: JSON.stringify({exhibit_id:5})
}, function(err, response, body) {
  console.log(response.body);
});
