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


function layer(exhibit_id, count, zoom, color) {

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
      'max_zoom,'+
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
      exhibit_id+','+
      '"Record'+n+'",'+
      '"Description'+n+'",'+
      '1,'+
      '"'+color+'",'+
      '"#000000",'+
      '"'+color+'",'+
      rad+','+
      100+','+
      100+','+
      30+','+
      90+','+
      2+','+
      zoom+','+
      zoom+','+
      geo+
    ')';

    // Comma, except for last.
    if (n != count-1) sql += ',';

  });

  client.query(sql);

}


// Create exhibit.
var sql = 'INSERT INTO omeka_neatline_exhibits ' +
  '(title, slug) VALUES ("dev", "dev")';

client.query(sql, function(err, res) {

  layer(res.insertId, 200, 3, '#00ff24');
  layer(res.insertId, 500, 4, '#00aeff');
  layer(res.insertId, 5000, 5, '#0006ff');
  layer(res.insertId, 20000, 6, '#7800ff');
  layer(res.insertId, 50000, 7, '#f000ff');
  layer(res.insertId, 100000, 8, '#ff0000');

  client.end(function() {
    process.exit();
  });

});
