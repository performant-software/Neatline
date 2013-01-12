
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record form spatial tab.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Spatial Tab', function() {


  var els;


  beforeEach(function() {

    _t.loadEditor();
    _t.openRecordForm();

    els = {
      pan:      _t.vw.record.$('input[value="pan"]'),
      point:    _t.vw.record.$('input[value="point"]'),
      line:     _t.vw.record.$('input[value="line"]'),
      poly:     _t.vw.record.$('input[value="poly"]'),
      regPoly:  _t.vw.record.$('input[value="regPoly"]'),
      modify:   _t.vw.record.$('input[value="modify"]'),
      rotate:   _t.vw.record.$('input[value="rotate"]'),
      resize:   _t.vw.record.$('input[value="resize"]'),
      drag:     _t.vw.record.$('input[value="drag"]'),
      remove:   _t.vw.record.$('input[value="remove"]'),
      coverage: _t.vw.record.$('textarea[name="coverage"]'),
      sides:    _t.vw.record.__ui.spatial.sides,
      snap:     _t.vw.record.__ui.spatial.snap,
      irreg:    _t.vw.record.__ui.spatial.irreg
    };

  });


  it('should set draw point mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Point" radio button is selected, the corresponding
    // drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Point".
    els.pan.removeAttr('checked');
    els.point.attr('checked', 'checked');
    els.point.trigger('change');

    // "Draw Point" should be active.
    expect(_t.vw.map.controls.point.active).toBeTruthy();

  });


  it('should set draw line mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Line" radio button is selected, the corresponding
    // drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Line".
    els.pan.removeAttr('checked');
    els.line.attr('checked', 'checked');
    els.line.trigger('change');

    // "Draw Line" should be active.
    expect(_t.vw.map.controls.line.active).toBeTruthy();

  });


  it('should set draw polygon mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Polygon" radio button is selected, the corresponding
    // drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Polygon".
    els.pan.removeAttr('checked');
    els.poly.attr('checked', 'checked');
    els.poly.trigger('change');

    // "Draw Polygon" should be active.
    expect(_t.vw.map.controls.poly.active).toBeTruthy();

  });


  it('should set draw regular polygon mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Regular Polygon" radio button is selected, the
    // corresponding drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Regular Polygon".
    els.pan.removeAttr('checked');
    els.regPoly.attr('checked', 'checked');
    els.regPoly.trigger('change');

    // "Draw Regular Polygon" should be active.
    expect(_t.vw.map.controls.regPoly.active).toBeTruthy();

  });


  it('should set modify shape mode', function() {

    // --------------------------------------------------------------------
    // When the "Modify Shape" radio button is selected, the corresponding
    // modifyFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Modify Shape".
    els.pan.removeAttr('checked');
    els.modify.attr('checked', 'checked');
    els.modify.trigger('change');

    // "Modify Shape" should be active.
    expect(_t.vw.map.controls.edit.active).toBeTruthy();

  });


  it('should set delete shape mode', function() {

    // --------------------------------------------------------------------
    // When the "Delete Shape" radio button is selected, the corresponding
    // modifyFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Delete Shape".
    els.pan.removeAttr('checked');
    els.remove.attr('checked', 'checked');
    els.remove.trigger('change');

    // "Delete Shape" should be active.
    expect(_t.vw.map.controls.remove.active).toBeTruthy();

  });


  it('should set sides', function() {

    // --------------------------------------------------------------------
    // When a new value is entered into the "Sides" input, the `sides`
    // property on the modifyFeature control should be updated.
    // --------------------------------------------------------------------

    // Set sides.
    els.sides.val('10');
    els.sides.trigger('change');

    // "Sides" be updated.
    expect(_t.vw.map.controls.regPoly.handler.sides).toEqual(10);

  });


  it('should set snap angle', function() {

    // --------------------------------------------------------------------
    // When a new value is entered into the "Snap Angle" input, the
    // `snapAngle` property on the modifyFeature control should be updated.
    // --------------------------------------------------------------------

    // Set snap angle.
    els.snap.val('45');
    els.snap.trigger('change');

    // "Snap Angle" be updated.
    expect(_t.vw.map.controls.regPoly.handler.snapAngle).toEqual(45);

  });


  it('should set irregular polygon', function() {

    // --------------------------------------------------------------------
    // When the "Irregular" checkbox is changed, the `irregular` property
    // on the modifyFeature control should be updated.
    // --------------------------------------------------------------------

    // Set irregular.
    els.irreg.attr('checked', 'checked');
    els.irreg.trigger('change');

    // "Irregular" be active.
    expect(_t.vw.map.controls.regPoly.handler.irregular).toEqual(true);

    // Unset irregular.
    els.irreg.removeAttr('checked');
    els.irreg.trigger('change');

    // "Irregular" be inactive.
    expect(_t.vw.map.controls.regPoly.handler.irregular).toEqual(false);

  });


  it('should set rotation', function() {

    // --------------------------------------------------------------------
    // When the "Rotate" option under "Modify Shape" is checked, `ROTATE`
    // mode should be activated on the modifyFeature control.
    // --------------------------------------------------------------------

    // Set rotate.
    els.rotate.attr('checked', 'checked');
    els.rotate.trigger('change');

    // Rotation should be active.
    expect(_t.vw.map.controls.edit.mode).toEqual(
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
    els.resize.attr('checked', 'checked');
    els.resize.trigger('change');

    // Resize should be active.
    expect(_t.vw.map.controls.edit.mode).toEqual(
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
    els.drag.attr('checked', 'checked');
    els.drag.trigger('change');

    // Drag should be active.
    expect(_t.vw.map.controls.edit.mode).toEqual(
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
    _t.vw.map.controls.point.drawFeature(pt);

    // "Coverage" should be updated.
    expect(els.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2),POINT(3 4))'
    );

  });


  it('should update "Spatial Data" on line add', function() {

    // --------------------------------------------------------------------
    // When a new line geometry is added to the map, the "Spatial" text
    // area should be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Create a new point, trigger modify.
    var pt1   = new OpenLayers.Geometry.Point(1,2);
    var pt2   = new OpenLayers.Geometry.Point(3,4);
    var line  = new OpenLayers.Geometry.LineString([pt1,pt2]);
    _t.vw.map.controls.line.drawFeature(line);

    // "Coverage" should be updated.
    expect(els.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2),LINESTRING(1 2,3 4))'
    );

  });


  it('should update "Spatial Data" on polygon add', function() {

    // --------------------------------------------------------------------
    // When a new polygon geometry is added to the map, the "Spatial" text
    // area should be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Create a new point, trigger modify.
    var pt1   = new OpenLayers.Geometry.Point(1,2);
    var pt2   = new OpenLayers.Geometry.Point(3,4);
    var pt3   = new OpenLayers.Geometry.Point(5,6);
    var ring  = new OpenLayers.Geometry.LinearRing([pt1,pt2,pt3]);
    var poly  = new OpenLayers.Geometry.Polygon([ring]);
    _t.vw.map.controls.poly.drawFeature(poly);

    // "Coverage" should be updated.
    expect(els.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2),POLYGON((1 2,3 4,5 6,1 2)))'
    );

  });


  it('should update "Spatial Data" on regular polygon add', function() {

    // --------------------------------------------------------------------
    // When a new regular polygon geometry is added to the map, the
    // "Spatial" text area should be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Create a new point, trigger modify.
    var pt1   = new OpenLayers.Geometry.Point(1,2);
    var pt2   = new OpenLayers.Geometry.Point(3,4);
    var pt3   = new OpenLayers.Geometry.Point(5,6);
    var ring  = new OpenLayers.Geometry.LinearRing([pt1,pt2,pt3]);
    var poly  = new OpenLayers.Geometry.Polygon([ring]);
    _t.vw.map.controls.regPoly.drawFeature(poly);

    // "Coverage" should be updated.
    expect(els.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2),POLYGON((1 2,3 4,5 6,1 2)))'
    );

  });


  it('should update "Spatial Data" on feature edit', function() {

    // --------------------------------------------------------------------
    // When an existing geometry is edited, the "Spatial" text area should
    // be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Edit feature, set new point coords.
    var feature = _t.vw.map.editLayer.features[0];
    _t.vw.map.controls.edit.feature = feature;
    feature.geometry.x = 2;
    feature.geometry.y = 3;

    // Trigger modification.
    _t.vw.map.controls.edit.dragComplete();

    // "Coverage" should be updated.
    expect(els.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(2 3))'
    );

  });


  it('should update "Spatial Data" on feature delete', function() {

    // --------------------------------------------------------------------
    // When an existing geometry is deleted, the "Spatial" text area
    // should be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Edit feature, set new point coords.
    var feature = _t.vw.map.editLayer.features[0];

    // Trigger modification.
    _t.vw.map.controls.remove.selectFeature(feature);

    // "Coverage" should be updated.
    expect(els.coverage.val()).toEqual('');

  });


});
