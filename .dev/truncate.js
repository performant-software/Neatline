/*
 * Create exhibit.
 */

var mysql = require('mysql');

var client = mysql.createConnection({
  host: 'localhost',
  user: 'omeka',
  password: 'omeka',
  port: 8889,
  database: 'tei'
});

client.connect();

// Truncate exhibits and records.
client.query('TRUNCATE TABLE omeka_neatline_exhibits');
client.query('TRUNCATE TABLE omeka_neatline_records');
client.query('TRUNCATE TABLE omeka_neatline_tags');

client.end(function() {
  process.exit();
});
