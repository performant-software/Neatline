
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var mysql = require('mysql');
var randy = require('randy');
var _s    = require('underscore.string');
var _     = require('underscore');
var fs    = require('fs');


// Connect to MySQL.
var client = mysql.createConnection({
  host:     'localhost',
  user:     'omeka',
  password: 'omeka',
  port:     8889,
  database: 'alpha2'
});

client.connect();


function color() {
  return "#"+((1<<24)*Math.random()|0).toString(16);
}


function records(exhibit_id, count, zoom) {

  // Base insert.
  var sql = 'INSERT INTO omeka_neatline_records (' +
      'exhibit_id,'+
      'is_coverage,'+
      'title,'+
      'body,'+
      'tags,'+
      'presenter,'+
      'fill_color,'+
      'fill_color_select,'+
      'stroke_color,'+
      'stroke_color_select,'+
      'fill_opacity,'+
      'fill_opacity_select,'+
      'stroke_opacity,'+
      'stroke_opacity_select,'+
      'point_radius,'+
      'stroke_width,'+
      'min_zoom,'+
      'max_zoom,'+
      'coverage'+
      ') VALUES';

  _(count).times(function(n) {

    var off = randy.randInt(0,len-500);
    var lon = randy.randInt(-14277213,-7301264);
    var lat = randy.randInt(2726050,6522218);
    var geo = 'GeomFromText("POINT('+lon+' '+lat+')")';
    var rad = randy.randInt(10,100);
    var bod = wp.slice(off, off+500);

    var tags = 'precinct, '+
      randy.choice(['democrat', 'republican']);

    sql += '(' +
      exhibit_id+','+       // exhibit_id
      1+','+                // is_coverage
      '"Precinct '+n+'",'+  // title
      '"'+bod+'",'+         // body
      '"'+tags+'",'+        // tags
      '"StaticBubble",'+    // presenter
      '"#000000",'+         // fill_color
      '"#000000",'+         // fill_color_select
      '"#000000",'+         // stroke_color
      '"#000000",'+         // stroke_color_select
      0.5+','+              // fill_opacity
      0.6+','+              // fill_opacity_select
      0.8+','+              // stroke_opacity
      1.0+','+              // stroke_opacity_select
      rad+','+              // point_radius
      0+','+                // stroke_width
      zoom+','+             // min_zoom
      zoom+','+             // max_zoom
      geo+                  // coverage
    ')';

    if (n != count-1) sql += ',';

  });

  client.query(sql);

}


var wp, len;

// Create exhibit.
var sql = 'INSERT INTO omeka_neatline_exhibits ' +
  '(title, slug, base_layer) VALUES ("Neatline Stylesheets", "neatline-stylesheets", "OpenStreetMap")';

client.query(sql, function(err, res) {

  // Read War and Peace.
  fs.readFile('./wp.txt', 'utf8', function(err, text) {

    wp = text;
    len = text.length

    records(res.insertId, 200, 6, color());
    records(res.insertId, 1000, 7, color());
    records(res.insertId, 5000, 8, color());
    records(res.insertId, 20000, 9, color());
    records(res.insertId, 73800, 10, color());

    client.end(function() {
      process.exit();
    });

  });

});
