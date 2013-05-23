var request = require('request');

request({
  url: 'http://localhost:8888/alpha2/neatline/records/debug'
  // method: 'POST',
  // body: JSON.stringify({exhibit_id : 4, title: 'test'})
}, function(err, response, body) {
  console.log(response.body);
});
