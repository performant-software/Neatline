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


function records(exhibit_id, count, zoom, color, tags) {

  // Base insert.
  var sql = 'INSERT INTO omeka_neatline_records (' +
      'exhibit_id,'+
      'title,'+
      '_title,'+
      'body,'+
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

    var off = randy.randInt(0,len-500)
    var lat = randy.randInt(-20000000,20000000);
    var lon = randy.randInt(-20000000,20000000);
    var geo = 'GeomFromText("POINT('+lon+' '+lat+')")';
    var rad = randy.randInt(10,100);
    var bod = wp.slice(off, off+500);

    sql += '(' +
      exhibit_id+','+
      '"Record'+n+'",'+
      '"Record'+n+'",'+
      '"'+bod+'",'+
      '"'+bod+'",'+
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


var wp, len;

// Create exhibit.
var sql = 'INSERT INTO omeka_neatline_exhibits ' +
  '(title, slug) VALUES ("dev", "dev")';

client.query(sql, function(err, res) {

  // Read War and Peace.
  fs.readFile('./wp.txt', 'utf8', function(err, text) {

    wp = text;
    len = text.length

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

});
