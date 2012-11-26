
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Tests for form spatial tab.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Form Spatial Tab', function() {

  var server, records, models;
  var json = readFixtures('records.json');

  // Get fixtures.
  beforeEach(function() {

    // Load partial, mock server.
    loadFixtures('editor-partial.html');
    server = sinon.fakeServer.create();

    // Run Editor.
    _t.loadEditor();

    // Intercept requests.
    _.each(server.requests, function(r) {
      _t.respond200(r, json);
    });

    // Get models record listings.
    records = _t.records.$el.find('.record-row');
    models = Editor.Modules.Records.collection.models;

    // Open form.
    $(records[0]).trigger('click');

  });

  it('should select "Navigate" by default', function() {
    var control = $('input[name="mapControls"]:checked').val();
    expect(control).toEqual('pan');
  });

  it('should set draw point mode', function() {

    // Check "Draw Point."
    var point = $('input[name="mapControls"][value="point"]');
    point.attr('checked', 'checked');
    point.trigger('change');

    // Check for control activation.
    expect(_t.map.controls.point.active).toBeTruthy();

  });

  it('should set draw line mode', function() {

    // Check "Draw Line."
    var line = $('input[name="mapControls"][value="line"]');
    line.attr('checked', 'checked');
    line.trigger('change');

    // Check for control activation.
    expect(_t.map.controls.line.active).toBeTruthy();

  });

  it('should set draw polygon mode', function() {

    // Check "Draw Polygon."
    var poly = $('input[name="mapControls"][value="poly"]');
    poly.attr('checked', 'checked');
    poly.trigger('change');

    // Check for control activation.
    expect(_t.map.controls.poly.active).toBeTruthy();

  });

  it('should set draw regular polygon mode', function() {

    // Check "Draw Regular Polygon."
    var reg = $('input[name="mapControls"][value="regPoly"]');
    reg.attr('checked', 'checked');
    reg.trigger('change');

    // Check for control activation.
    expect(_t.map.controls.reg.active).toBeTruthy();

  });

  it('should set modify shape mode', function() {

    // Check "Modify Shape."
    var modify = $('input[name="mapControls"][value="modify"]');
    modify.attr('checked', 'checked');
    modify.trigger('change');

    // Check for control activation.
    expect(_t.map.controls.edit.active).toBeTruthy();

  });

  it('should set delete shape mode', function() {

    // Check "Delete Shape."
    var del = $('input[name="mapControls"][value="delete"]');
    del.attr('checked', 'checked');
    del.trigger('change');

    // Check for control activation.
    expect(_t.map.controls.del.active).toBeTruthy();

  });

  it('should set regular polygon options', function() {

    // Set options.
    _t.form.sides.val('10');
    _t.form.snap.val('45');
    _t.form.irregular.attr('checked', 'checked');
    _t.form.irregular.trigger('change');

    // Check settings.
    expect(_t.map.controls.reg.handler.sides).toEqual(10);
    expect(_t.map.controls.reg.handler.snapAngle).toEqual(45);
    expect(_t.map.controls.reg.handler.irregular).toEqual(true);

  });

  it('should set rotation', function() {

    // Set options.
    var rotate = $('input[name="modifySettings"][value="rotate"]');
    rotate.attr('checked', 'checked');
    rotate.trigger('change');

    // Check settings.
    expect(_t.map.controls.edit.mode).toEqual(
      OpenLayers.Control.ModifyFeature.RESHAPE |
      OpenLayers.Control.ModifyFeature.ROTATE
    );

  });

  it('should set resize', function() {

    // Set options.
    var resize = $('input[name="modifySettings"][value="resize"]');
    resize.attr('checked', 'checked');
    resize.trigger('change');

    // Check settings.
    expect(_t.map.controls.edit.mode).toEqual(
      OpenLayers.Control.ModifyFeature.RESHAPE |
      OpenLayers.Control.ModifyFeature.RESIZE
    );

  });

  it('should set drag', function() {

    // Set options.
    var drag = $('input[name="modifySettings"][value="drag"]');
    drag.attr('checked', 'checked');
    drag.trigger('change');

    // Check settings.
    expect(_t.map.controls.edit.mode).toEqual(
      OpenLayers.Control.ModifyFeature.RESHAPE |
      OpenLayers.Control.ModifyFeature.DRAG
    );

  });

  it('should update "Spatial Data" on point add', function() {

    // Create a new point, trigger modify.
    var pt = new OpenLayers.Geometry.Point(3,4);
    _t.map.controls.point.drawFeature(pt);

    // Check for new data.
    expect(_t.form.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 1),POINT(3 4))'
    );

  });

  it('should update "Spatial Data" on line add', function() {

    // Create a new point, trigger modify.
    var pt1 = new OpenLayers.Geometry.Point(1,2);
    var pt2 = new OpenLayers.Geometry.Point(3,4);
    var line = new OpenLayers.Geometry.LineString([pt1,pt2]);
    _t.map.controls.line.drawFeature(line);

    // Check for new data.
    expect(_t.form.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 1),LINESTRING(1 2,3 4))'
    );

  });

  it('should update "Spatial Data" on polygon add', function() {

    // Create a new point, trigger modify.
    var pt1 = new OpenLayers.Geometry.Point(1,2);
    var pt2 = new OpenLayers.Geometry.Point(3,4);
    var pt3 = new OpenLayers.Geometry.Point(5,6);
    var ring = new OpenLayers.Geometry.LinearRing([pt1,pt2,pt3]);
    var poly = new OpenLayers.Geometry.Polygon([ring]);
    _t.map.controls.poly.drawFeature(poly);

    // Check for new data.
    expect(_t.form.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 1),POLYGON((1 2,3 4,5 6,1 2)))'
    );

  });

  it('should update "Spatial Data" on regular polygon add', function() {

    // Create a new point, trigger modify.
    var pt1 = new OpenLayers.Geometry.Point(1,2);
    var pt2 = new OpenLayers.Geometry.Point(3,4);
    var pt3 = new OpenLayers.Geometry.Point(5,6);
    var ring = new OpenLayers.Geometry.LinearRing([pt1,pt2,pt3]);
    var poly = new OpenLayers.Geometry.Polygon([ring]);
    _t.map.controls.reg.drawFeature(poly);

    // Check for new data.
    expect(_t.form.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 1),POLYGON((1 2,3 4,5 6,1 2)))'
    );

  });

  it('should update "Spatial Data" on feature edit', function() {

    // Edit feature, set new point coords.
    var feature = _t.map.editLayer.features[0];
    _t.map.controls.edit.feature = feature;
    feature.geometry.x = 1;
    feature.geometry.y = 2;

    // Trigger modification.
    _t.map.controls.edit.dragComplete();

    // Check for new data.
    expect(_t.form.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2))'
    );

  });

  it('should update "Spatial Data" on feature delete', function() {

    // Edit feature, set new point coords.
    var feature = _t.map.editLayer.features[0];

    // Trigger modification.
    _t.map.controls.del.selectFeature(feature);

    // Check for new data.
    expect(_t.form.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION()'
    );

  });

});
