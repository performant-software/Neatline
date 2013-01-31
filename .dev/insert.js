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


function records(exhibit_id, count, zoom, color, tags) {

  // Base insert.
  var sql = 'INSERT INTO omeka_neatline_records (' +
      'exhibit_id,'+
      '_title,'+
      '_body,'+
      'tags,'+
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
      '"'+tags+'",'+
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

  records(res.insertId, 200, 3, '#00ff24', 'level3');
  records(res.insertId, 400, 4, '#00aeff', 'level4');
  records(res.insertId, 5000, 5, '#0006ff', 'level5');
  records(res.insertId, 20000, 6, '#7800ff', 'level6');
  records(res.insertId, 50000, 7, '#f000ff', 'level7');
  records(res.insertId, 100000, 8, '#ff0000', 'level8');

  client.end(function() {
    process.exit();
  });

});
