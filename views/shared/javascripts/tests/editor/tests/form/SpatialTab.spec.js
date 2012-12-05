
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for form spatial tab.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Form Spatial Tab', function() {

  // Start editor.
  beforeEach(function() {

    _t.loadEditor();

    // Open Record 1 form.
    var recordRows = _t.getRecordRows();
    $(recordRows[0]).trigger('click');

  });

  it('should select "Navigate" by default', function() {

    // --------------------------------------------------------------------
    // The "Navigate" should be selected when the form is opened.
    // --------------------------------------------------------------------

    expect(_t.spatialTabView.getMapControl()).toEqual('pan');

  });

  it('should set draw point mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Point" radio button is selected, the corresponding
    // drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Point."
    _t.spatialTabView.pan.removeAttr('checked');
    _t.spatialTabView.point.attr('checked', 'checked');
    _t.spatialTabView.point.trigger('change');

    // Check for control activation.
    expect(_t.mapView.controls.point.active).toBeTruthy();

  });

  it('should set draw line mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Line" radio button is selected, the corresponding
    // drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Line."
    _t.spatialTabView.pan.removeAttr('checked');
    _t.spatialTabView.line.attr('checked', 'checked');
    _t.spatialTabView.line.trigger('change');

    // Check for control activation.
    expect(_t.mapView.controls.line.active).toBeTruthy();

  });

  it('should set draw polygon mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Polygon" radio button is selected, the corresponding
    // drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Polygon."
    _t.spatialTabView.pan.removeAttr('checked');
    _t.spatialTabView.poly.attr('checked', 'checked');
    _t.spatialTabView.poly.trigger('change');

    // Check for control activation.
    expect(_t.mapView.controls.poly.active).toBeTruthy();

  });

  it('should set draw regular polygon mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Regular Polygon" radio button is selected, the
    // corresponding drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Regular Polygon."
    _t.spatialTabView.pan.removeAttr('checked');
    _t.spatialTabView.regPoly.attr('checked', 'checked');
    _t.spatialTabView.regPoly.trigger('change');

    // Check for control activation.
    expect(_t.mapView.controls.reg.active).toBeTruthy();

  });

  it('should set modify shape mode', function() {

    // --------------------------------------------------------------------
    // When the "Modify Shape" radio button is selected, the corresponding
    // modifyFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Modify Shape."
    _t.spatialTabView.pan.removeAttr('checked');
    _t.spatialTabView.modify.attr('checked', 'checked');
    _t.spatialTabView.modify.trigger('change');

    // Check for control activation.
    expect(_t.mapView.controls.edit.active).toBeTruthy();

  });

  it('should set delete shape mode', function() {

    // --------------------------------------------------------------------
    // When the "Delete Shape" radio button is selected, the corresponding
    // modifyFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Delete Shape."
    _t.spatialTabView.pan.removeAttr('checked');
    _t.spatialTabView.remove.attr('checked', 'checked');
    _t.spatialTabView.remove.trigger('change');

    // Check for control activation.
    expect(_t.mapView.controls.del.active).toBeTruthy();

  });

  it('should set sides', function() {

    // --------------------------------------------------------------------
    // When a new value is entered into the "Sides" input, the `sides`
    // property on the modifyFeature control should be updated.
    // --------------------------------------------------------------------

    // Set sides.
    _t.spatialTabView.sides.val('10');

    // Trigger change.
    _t.spatialTabView.sides.trigger('change');

    // Check settings.
    expect(_t.mapView.controls.reg.handler.sides).toEqual(10);

  });

  it('should set snap angle', function() {

    // --------------------------------------------------------------------
    // When a new value is entered into the "Snap Angle" input, the
    // `snapAngle` property on the modifyFeature control should be updated.
    // --------------------------------------------------------------------

    // Set snap angle.
    _t.spatialTabView.snap.val('45');

    // Trigger change.
    _t.spatialTabView.snap.trigger('change');

    // Check settings.
    expect(_t.mapView.controls.reg.handler.snapAngle).toEqual(45);

  });

  it('should set irregular polygon', function() {

    // --------------------------------------------------------------------
    // When a new value is entered into the "Irregular" input, the
    // `irregular` property on the modifyFeature control should be updated.
    // --------------------------------------------------------------------

    // Set irregular.
    _t.spatialTabView.irregular.attr('checked', 'checked');

    // Trigger change.
    _t.spatialTabView.sides.trigger('change');

    // Check settings.
    expect(_t.mapView.controls.reg.handler.irregular).toEqual(true);

    // Unset irregular.
    _t.spatialTabView.irregular.removeAttr('checked');

    // Trigger change.
    _t.spatialTabView.irregular.trigger('change');

    // Check settings.
    expect(_t.mapView.controls.reg.handler.irregular).toEqual(false);

  });

  it('should set rotation', function() {

    // --------------------------------------------------------------------
    // When the "Rotate" option under "Modify Shape" is checked, `ROTATE`
    // mode should be activated on the modifyFeature control.
    // --------------------------------------------------------------------

    // Set options.
    var rotate = $('input[name="modifyOptions"][value="rotate"]');
    rotate.attr('checked', 'checked');
    rotate.trigger('change');

    // Check settings.
    expect(_t.mapView.controls.edit.mode).toEqual(
      OpenLayers.Control.ModifyFeature.RESHAPE |
      OpenLayers.Control.ModifyFeature.ROTATE
    );

  });

  it('should set resize', function() {

    // --------------------------------------------------------------------
    // When the "Resize" option under "Modify Shape" is checked, `RESIZE`
    // mode should be activated on the modifyFeature control.
    // --------------------------------------------------------------------

    // Set options.
    var resize = $('input[name="modifyOptions"][value="resize"]');
    resize.attr('checked', 'checked');
    resize.trigger('change');

    // Check settings.
    expect(_t.mapView.controls.edit.mode).toEqual(
      OpenLayers.Control.ModifyFeature.RESHAPE |
      OpenLayers.Control.ModifyFeature.RESIZE
    );

  });

  it('should set drag', function() {

    // --------------------------------------------------------------------
    // When the "Drag" option under "Modify Shape" is checked, `DRAG` mode
    // should be activated on the modifyFeature control.
    // --------------------------------------------------------------------

    // Set options.
    var drag = $('input[name="modifyOptions"][value="drag"]');
    drag.attr('checked', 'checked');
    drag.trigger('change');

    // Check settings.
    expect(_t.mapView.controls.edit.mode).toEqual(
      OpenLayers.Control.ModifyFeature.RESHAPE |
      OpenLayers.Control.ModifyFeature.DRAG
    );

  });

  it('should update "Spatial Data" on point add', function() {

    // --------------------------------------------------------------------
    // When a new point geometry is added to the map, the "Spatial" text
    // area should be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Create a new point, trigger modify.
    var pt = new OpenLayers.Geometry.Point(3,4);
    _t.mapView.controls.point.drawFeature(pt);

    // Check for new data.
    expect(_t.spatialTabView.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2),POINT(3 4))'
    );

  });

  it('should update "Spatial Data" on line add', function() {

    // --------------------------------------------------------------------
    // When a new line geometry is added to the map, the "Spatial" text
    // area should be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Create a new point, trigger modify.
    var pt1 = new OpenLayers.Geometry.Point(1,2);
    var pt2 = new OpenLayers.Geometry.Point(3,4);
    var line = new OpenLayers.Geometry.LineString([pt1,pt2]);
    _t.mapView.controls.line.drawFeature(line);

    // Check for new data.
    expect(_t.spatialTabView.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2),LINESTRING(1 2,3 4))'
    );

  });

  it('should update "Spatial Data" on polygon add', function() {

    // --------------------------------------------------------------------
    // When a new polygon geometry is added to the map, the "Spatial" text
    // area should be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Create a new point, trigger modify.
    var pt1 = new OpenLayers.Geometry.Point(1,2);
    var pt2 = new OpenLayers.Geometry.Point(3,4);
    var pt3 = new OpenLayers.Geometry.Point(5,6);
    var ring = new OpenLayers.Geometry.LinearRing([pt1,pt2,pt3]);
    var poly = new OpenLayers.Geometry.Polygon([ring]);
    _t.mapView.controls.poly.drawFeature(poly);

    // Check for new data.
    expect(_t.spatialTabView.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2),POLYGON((1 2,3 4,5 6,1 2)))'
    );

  });

  it('should update "Spatial Data" on regular polygon add', function() {

    // --------------------------------------------------------------------
    // When a new regular polygon geometry is added to the map, the
    // "Spatial" text area should be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Create a new point, trigger modify.
    var pt1 = new OpenLayers.Geometry.Point(1,2);
    var pt2 = new OpenLayers.Geometry.Point(3,4);
    var pt3 = new OpenLayers.Geometry.Point(5,6);
    var ring = new OpenLayers.Geometry.LinearRing([pt1,pt2,pt3]);
    var poly = new OpenLayers.Geometry.Polygon([ring]);
    _t.mapView.controls.reg.drawFeature(poly);

    // Check for new data.
    expect(_t.spatialTabView.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2),POLYGON((1 2,3 4,5 6,1 2)))'
    );

  });

  it('should update "Spatial Data" on feature edit', function() {

    // --------------------------------------------------------------------
    // When an existing geometry is edited, the "Spatial" text area should
    // be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Edit feature, set new point coords.
    var feature = _t.mapView.editLayer.features[0];
    _t.mapView.controls.edit.feature = feature;
    feature.geometry.x = 2;
    feature.geometry.y = 3;

    // Trigger modification.
    _t.mapView.controls.edit.dragComplete();

    // Check for new data.
    expect(_t.spatialTabView.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(2 3))'
    );

  });

  it('should update "Spatial Data" on feature delete', function() {

    // --------------------------------------------------------------------
    // When an existing geometry is deleted, the "Spatial" text area
    // should be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Edit feature, set new point coords.
    var feature = _t.mapView.editLayer.features[0];

    // Trigger modification.
    _t.mapView.controls.del.selectFeature(feature);

    // Check for new data.
    expect(_t.spatialTabView.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION()'
    );

  });

});
