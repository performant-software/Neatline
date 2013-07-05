
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var mysql = require('mysql');

var client = mysql.createConnection({
  host: 'localhost',
  user: 'omeka',
  password: 'omeka',
  port: 8889,
  database: 'alpha3'
});

client.connect();

// Truncate exhibits and records.
client.query('TRUNCATE TABLE omeka_neatline_exhibits');
client.query('TRUNCATE TABLE omeka_neatline_records');

client.end(function() {
  process.exit();
});
