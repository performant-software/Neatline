var request = require('request');

request({
  url: 'http://localhost:8888/alpha2/neatline/records/11',
  method: 'DELETE'
}, function(err, response, body) {
  console.log(response);
});
