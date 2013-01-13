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


function records(exhibit_id, count, zoom, color) {

  // Base insert.
  var sql = 'INSERT INTO omeka_neatline_records (' +
      'exhibit_id,'+
      'title,'+
      'body,'+
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

  _(count).times(function(n) {

    var lat = randy.randInt(-20000000,20000000);
    var lon = randy.randInt(-20000000,20000000);
    var geo = 'GeomFromText("POINT('+lon+' '+lat+')")';
    var rad = randy.randInt(10,100);

    sql += '(' +
      exhibit_id+','+
      '"Record'+n+'",'+
      '"Body'+n+'",'+
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

    if (n != count-1) sql += ',';

  });

  client.query(sql);

}


function tags(exhibit_id, count) {

  var sql = 'INSERT INTO omeka_neatline_tags (' +
      'exhibit_id,'+
      'tag'+
      ') VALUES';

  _(count).times(function(n) {

    sql += '(' +
      exhibit_id+','+
      '"tag'+n+'"'+
    ')';

    if (n != count-1) sql += ',';

  });

  client.query(sql);

}


// Create exhibit.
var sql = 'INSERT INTO omeka_neatline_exhibits ' +
  '(title, slug) VALUES ("dev", "dev")';

client.query(sql, function(err, res) {
  records(res.insertId, 400, 'NULL', '#00aeff');
  tags(res.insertId, 20);
  client.end(function() {
    process.exit();
  });

});
