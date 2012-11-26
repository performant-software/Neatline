/*
 * Create exhibit.
 */

var mysql = require('mysql');
var randy = require('randy');
var _ = require('underscore');

var client = mysql.createConnection({
  host: 'localhost',
  user: 'omeka',
  password: 'omeka',
  port: 8889,
  database: 'tei'
});

client.connect();

var count = parseInt(process.argv[2], 10);

// Create exhibit.
var sql = 'INSERT INTO omeka_neatline_exhibits ' +
  '(title, slug) VALUES ("dev", "dev")';

client.query(sql, function(err, res) {

  // Base insert.
  var sql = 'INSERT INTO omeka_neatline_records (' +
      'exhibit_id,'+
      'title,'+
      'description,'+
      'map_active,'+
      'vector_color,'+
      'stroke_color,'+
      'select_color,'+
      'point_radius,'+
      'stroke_opacity,'+
      'graphic_opacity,'+
      'vector_opacity,'+
      'select_opacity,'+
      'stroke_width,'+
      'min_zoom,'+
      'coverage'+
      ') VALUES';

  // Create records.
  _(count).times(function(n) {

    // Random coordinates, radius.
    var lat = randy.randInt(-20000000,20000000);
    var lon = randy.randInt(-20000000,20000000);
    var geo = 'GeomFromText("POINT('+lon+' '+lat+')")';
    var rad = randy.randInt(10,100);

    // Values.
    sql += '(' +
      res.insertId+','+
      '"Record'+n+'",'+
      '"Description'+n+'",'+
      '1,'+
      '"#fff600",'+
      '"#000000",'+
      '"#0030ff",'+
      rad+','+
      100+','+
      100+','+
      30+','+
      70+','+
      2+','+
      8+','+
      geo+
    ')';

    // Comma, except for last.
    if (n != count-1) sql += ',';

  });

  client.query(sql);
  client.end(function() {
    process.exit();
  });

});
