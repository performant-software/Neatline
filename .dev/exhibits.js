/*
 * Create exhibit.
 */

var mysql = require('mysql');
var randy = require('randy');
var _s = require('underscore.string');
var _ = require('underscore');
var fs = require('fs');


// Connect to MySQL.
var client = mysql.createConnection({
  host: 'localhost',
  user: 'omeka',
  password: 'omeka',
  port: 8889,
  database: 'tei'
});

client.connect();

_(100).times(function(i) {
  client.query('INSERT INTO omeka_neatline_exhibits ' +
  '(title, slug, base_layer) VALUES ("Exhibit'+i+'", '+i+', "OpenStreetMap")');
});
