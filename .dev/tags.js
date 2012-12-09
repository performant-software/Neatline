/*
 * Mock out tags structure.
 */

var mysql = require('mysql');
var async = require('async');
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
  var sql1 = 'INSERT INTO omeka_neatline_tags ' +
    '(tag, vector_color) VALUES ("vector_color", "#00aeff")';

  // Stroke color.
  var sql2 = 'INSERT INTO omeka_neatline_tags ' +
    '(tag, stroke_color) VALUES ("stroke_color", "#000000")';

  // Select color.
  var sql3 = 'INSERT INTO omeka_neatline_tags ' +
    '(tag, select_color) VALUES ("select_color", "#0054ff")';

  // Vector opacity.
  var sql4 = 'INSERT INTO omeka_neatline_tags ' +
    '(tag, vector_opacity) VALUES ("vector_opacity", 30)';

  // Select opacity.
  var sql5 = 'INSERT INTO omeka_neatline_tags ' +
    '(tag, select_opacity) VALUES ("select_opacity", 50)';

  // Stroke opacity.
  var sql6 = 'INSERT INTO omeka_neatline_tags ' +
    '(tag, stroke_opacity) VALUES ("stroke_opacity", 80)';

  // Image opacity.
  var sql7 = 'INSERT INTO omeka_neatline_tags ' +
    '(tag, image_opacity) VALUES ("image_opacity", 90)';

  // Stroke width.
  var sql8 = 'INSERT INTO omeka_neatline_tags ' +
    '(tag, stroke_width) VALUES ("stroke_width", 2)';

  // Point radius.
  var sql9 = 'INSERT INTO omeka_neatline_tags ' +
    '(tag, point_radius) VALUES ("point_radius", 10)';

  // Point image.
  var sql10 = 'INSERT INTO omeka_neatline_tags ' +
    '(tag, point_image) VALUES ("point_image", "file.png")';

  // Max zoom.
  var sql11 = 'INSERT INTO omeka_neatline_tags ' +
    '(tag, max_zoom) VALUES ("max_zoom", 15)';

  // Min zoom.
  var sql12 = 'INSERT INTO omeka_neatline_tags ' +
    '(tag, min_zoom) VALUES ("min_zoom", 5)';

  // Async query worker.
  var query = function(sql, cb) {
    client.query(sql, function(err, res) {
      cb(err, res);
    });
  };

  // Insert tags.
  async.map([
    sql1,
    sql2,
    sql3,
    sql4,
    sql5,
    sql6,
    sql7,
    sql8,
    sql9,
    sql10,
    sql11,
    sql12
  ], query, function(err, results) {

    // Create record.
    var sql = 'INSERT INTO omeka_neatline_records (' +
        'vector_color,'+
        'stroke_color,'+
        'select_color,'+
        'vector_opacity,'+
        'select_opacity,'+
        'stroke_opacity,'+
        'image_opacity,'+
        'stroke_width,'+
        'point_radius,'+
        'point_image,'+
        'max_zoom,'+
        'min_zoom'+
        ') VALUES';

    var c = 100000;
    _(c).times(function(n) {

      sql += '(' +
        results[0].insertId+','+
        results[1].insertId+','+
        results[2].insertId+','+
        results[3].insertId+','+
        results[4].insertId+','+
        results[5].insertId+','+
        results[6].insertId+','+
        results[7].insertId+','+
        results[8].insertId+','+
        results[9].insertId+','+
        results[10].insertId+','+
        results[11].insertId+')';

      if (n != c-1) sql += ',';

    });

    client.query(sql);
    client.end(function() {
      process.exit();
    });

  });

});
