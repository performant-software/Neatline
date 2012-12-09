/*
 * Mock out tags structure.
 */

var mysql = require('mysql');
var _ = require('underscore');

var client = mysql.createConnection({
  host: 'localhost',
  user: 'omeka',
  password: 'omeka',
  port: 8889,
  database: 'tei'
});

client.connect();


// Create exhibit.
var sql = 'INSERT INTO omeka_neatline_exhibits ' +
          '(title, slug) VALUES ("dev", "dev")';

client.query(sql, function(err, res) {

    // Vector color.
    var sql = 'INSERT INTO omeka_neatline_tags ' +
              '(tag, vector_color) VALUES ("vector-color", "#00aeff")';

  client.end(function() {
    process.exit();
  });

});





function layer(exhibit_id, count, zoom, color) {

  // Base insert.
  var sql = 'INSERT INTO omeka_neatline_records (' +
      'exhibit_id,'+
      'title,'+
      'body,'+
      'map_active,'+
      'vector_color,'+
      'stroke_color,'+
      'select_color,'+
      'point_radius,'+
      'stroke_opacity,'+
      'image_opacity,'+
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
      '"Body'+n+'",'+
      '1,'+
      '"'+color+'",'+
      '"#000000",'+
      '"'+color+'",'+
      rad+','+
      100+','+
      100+','+
      30+','+
      50+','+
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
