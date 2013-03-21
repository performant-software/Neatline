
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


  var el;


  beforeEach(function() {

    _t.loadEditor();
    _t.showFirstRecordForm();

    el = {
      text:     _t.vw.RECORD.$('a[href="#record-text"]'),
      spatial:  _t.vw.RECORD.$('a[href="#record-spatial"]'),
      pan:      _t.vw.RECORD.$('input[value="pan"]'),
      point:    _t.vw.RECORD.$('input[value="point"]'),
      line:     _t.vw.RECORD.$('input[value="line"]'),
      poly:     _t.vw.RECORD.$('input[value="poly"]'),
      svg:      _t.vw.RECORD.$('input[value="svg"]'),
      regPoly:  _t.vw.RECORD.$('input[value="regPoly"]'),
      modify:   _t.vw.RECORD.$('input[value="modify"]'),
      rotate:   _t.vw.RECORD.$('input[value="rotate"]'),
      resize:   _t.vw.RECORD.$('input[value="resize"]'),
      drag:     _t.vw.RECORD.$('input[value="drag"]'),
      remove:   _t.vw.RECORD.$('input[value="remove"]'),
      coverage: _t.vw.RECORD.$('textarea[name="coverage"]'),
      clear:    _t.vw.RECORD.$('a[name="clear"]'),
      parse:    _t.vw.RECORD.$('a[name="parse"]'),
      sides:    _t.vw.SPATIAL.__ui.sides,
      snap:     _t.vw.SPATIAL.__ui.snap,
      irreg:    _t.vw.SPATIAL.__ui.irreg
    };

  });


  it('should set draw point mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Point" radio button is selected, the corresponding
    // drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Point".
    el.pan.removeAttr('checked');
    el.point.attr('checked', 'checked');
    el.point.trigger('change');

    // "Draw Point" should be active.
    expect(_t.vw.MAP.controls.point.active).toBeTruthy();

  });


  it('should set draw line mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Line" radio button is selected, the corresponding
    // drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Line".
    el.pan.removeAttr('checked');
    el.line.attr('checked', 'checked');
    el.line.trigger('change');

    // "Draw Line" should be active.
    expect(_t.vw.MAP.controls.line.active).toBeTruthy();

  });


  it('should set draw polygon mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Polygon" radio button is selected, the corresponding
    // drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Polygon".
    el.pan.removeAttr('checked');
    el.poly.attr('checked', 'checked');
    el.poly.trigger('change');

    // "Draw Polygon" should be active.
    expect(_t.vw.MAP.controls.poly.active).toBeTruthy();

  });


  it('should set draw SVG mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw SVG" radio button is selected, the corresponding
    // drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw SVG".
    el.pan.removeAttr('checked');
    el.svg.attr('checked', 'checked');
    el.svg.trigger('change');

    // "Draw SVG" should be active.
    expect(_t.vw.MAP.controls.svg.active).toBeTruthy();

  });


  it('should set draw regular polygon mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Regular Polygon" radio button is selected, the
    // corresponding drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Regular Polygon".
    el.pan.removeAttr('checked');
    el.regPoly.attr('checked', 'checked');
    el.regPoly.trigger('change');

    // "Draw Regular Polygon" should be active.
    expect(_t.vw.MAP.controls.regPoly.active).toBeTruthy();

  });


  it('should set modify shape mode', function() {

    // --------------------------------------------------------------------
    // When the "Modify Shape" radio button is selected, the corresponding
    // modifyFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Modify Shape".
    el.pan.removeAttr('checked');
    el.modify.attr('checked', 'checked');
    el.modify.trigger('change');

    // "Modify Shape" should be active.
    expect(_t.vw.MAP.controls.edit.active).toBeTruthy();

  });


  it('should set delete shape mode', function() {

    // --------------------------------------------------------------------
    // When the "Delete Shape" radio button is selected, the corresponding
    // modifyFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Delete Shape".
    el.pan.removeAttr('checked');
    el.remove.attr('checked', 'checked');
    el.remove.trigger('change');

    // "Delete Shape" should be active.
    expect(_t.vw.MAP.controls.remove.active).toBeTruthy();

  });


  it('should set sides', function() {

    // --------------------------------------------------------------------
    // When a new value is entered into the "Sides" input, the `sides`
    // property on the modifyFeature control should be updated.
    // --------------------------------------------------------------------

    // Set sides.
    el.sides.val('10');
    el.sides.trigger('change');

    // "Sides" should be updated.
    expect(_t.vw.MAP.controls.regPoly.handler.sides).toEqual(10);

  });


  it('should set snap angle', function() {

    // --------------------------------------------------------------------
    // When a new value is entered into the "Snap Angle" input, the
    // `snapAngle` property on the modifyFeature control should be updated.
    // --------------------------------------------------------------------

    // Set snap angle.
    el.snap.val('45');
    el.snap.trigger('change');

    // "Snap Angle" should be updated.
    expect(_t.vw.MAP.controls.regPoly.handler.snapAngle).toEqual(45);

  });


  it('should set irregular polygon', function() {

    // --------------------------------------------------------------------
    // When the "Irregular" checkbox is changed, the `irregular` property
    // on the modifyFeature control should be updated.
    // --------------------------------------------------------------------

    // Set irregular.
    el.irreg.attr('checked', 'checked');
    el.irreg.trigger('change');

    // "Irregular" be active.
    expect(_t.vw.MAP.controls.regPoly.handler.irregular).toEqual(true);

    // Unset irregular.
    el.irreg.removeAttr('checked');
    el.irreg.trigger('change');

    // "Irregular" should be inactive.
    expect(_t.vw.MAP.controls.regPoly.handler.irregular).toEqual(false);

  });


  it('should set rotation', function() {

    // --------------------------------------------------------------------
    // When the "Rotate" option under "Modify Shape" is checked, `ROTATE`
    // mode should be activated on the modifyFeature control.
    // --------------------------------------------------------------------

    // Set rotate.
    el.rotate.attr('checked', 'checked');
    el.rotate.trigger('change');

    // Rotation should be active.
    expect(_t.vw.MAP.controls.edit.mode).toEqual(
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
    el.resize.attr('checked', 'checked');
    el.resize.trigger('change');

    // Resize should be active.
    expect(_t.vw.MAP.controls.edit.mode).toEqual(
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
    el.drag.attr('checked', 'checked');
    el.drag.trigger('change');

    // Drag should be active.
    expect(_t.vw.MAP.controls.edit.mode).toEqual(
      OpenLayers.Control.ModifyFeature.RESHAPE |
      OpenLayers.Control.ModifyFeature.DRAG
    );

  });


  it('should update coverage on point add', function() {

    // --------------------------------------------------------------------
    // When a new point geometry is added to the map, the coverage text
    // area should be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Create a new point, trigger modify.
    var pt = new OpenLayers.Geometry.Point(3,4);
    _t.vw.MAP.controls.point.drawFeature(pt);

    // "Coverage" should be updated.
    expect(el.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2),POINT(3 4))'
    );

  });


  it('should update coverage on line add', function() {

    // --------------------------------------------------------------------
    // When a new line geometry is added to the map, the coverage text
    // area should be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Create a new point, trigger modify.
    var pt1   = new OpenLayers.Geometry.Point(3,4);
    var pt2   = new OpenLayers.Geometry.Point(5,6);
    var line  = new OpenLayers.Geometry.LineString([pt1,pt2]);
    _t.vw.MAP.controls.line.drawFeature(line);

    // "Coverage" should be updated.
    expect(el.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2),LINESTRING(3 4,5 6))'
    );

  });


  it('should update coverage on polygon add', function() {

    // --------------------------------------------------------------------
    // When a new polygon geometry is added to the map, the coverage text
    // area should be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Create a new point, trigger modify.
    var pt1   = new OpenLayers.Geometry.Point(3,4);
    var pt2   = new OpenLayers.Geometry.Point(5,6);
    var pt3   = new OpenLayers.Geometry.Point(7,8);
    var ring  = new OpenLayers.Geometry.LinearRing([pt1,pt2,pt3]);
    var poly  = new OpenLayers.Geometry.Polygon([ring]);
    _t.vw.MAP.controls.poly.drawFeature(poly);

    // "Coverage" should be updated.
    expect(el.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2),POLYGON((3 4,5 6,7 8,3 4)))'
    );

  });


  it('should update coverage on svg add', function() {

    // --------------------------------------------------------------------
    // When a new SVG-backed geometry collection is added to the map, the
    // coverage text area should be updated with the new WKT string.
    // --------------------------------------------------------------------

    var pt1 = new OpenLayers.Geometry.Point(3,4);
    var pt2 = new OpenLayers.Geometry.Point(5,6);
    var collection = new OpenLayers.Geometry.Collection([pt1, pt2]);
    _t.vw.MAP.controls.svg.drawFeature(collection);

    // "Coverage" should be updated.
    expect(el.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2),POINT(3 4),POINT(5 6))'
    );

  });


  it('should update coverage on svg polygon add', function() {

    // --------------------------------------------------------------------
    // When a new SVG-backed polygon geometry is added to the map, the
    // coverage text area should be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Create a new point, trigger modify.
    var pt1   = new OpenLayers.Geometry.Point(1,2);
    var pt2   = new OpenLayers.Geometry.Point(3,4);
    var pt3   = new OpenLayers.Geometry.Point(5,6);
    var ring  = new OpenLayers.Geometry.LinearRing([pt1,pt2,pt3]);
    var poly  = new OpenLayers.Geometry.Polygon([ring]);
    _t.vw.MAP.controls.svg.drawFeature(poly);

    // "Coverage" should be updated.
    expect(el.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2),POLYGON((1 2,3 4,5 6,1 2)))'
    );

  });


  it('should update coverage on regular polygon add', function() {

    // --------------------------------------------------------------------
    // When a new regular polygon geometry is added to the map, the
    // coverage text area should be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Create a new point, trigger modify.
    var pt1   = new OpenLayers.Geometry.Point(1,2);
    var pt2   = new OpenLayers.Geometry.Point(3,4);
    var pt3   = new OpenLayers.Geometry.Point(5,6);
    var ring  = new OpenLayers.Geometry.LinearRing([pt1,pt2,pt3]);
    var poly  = new OpenLayers.Geometry.Polygon([ring]);
    _t.vw.MAP.controls.regPoly.drawFeature(poly);

    // "Coverage" should be updated.
    expect(el.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(1 2),POLYGON((1 2,3 4,5 6,1 2)))'
    );

  });


  it('should update coverage on feature edit', function() {

    // --------------------------------------------------------------------
    // When an existing geometry is edited, the coverage text area should
    // be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Edit feature, set new point coords.
    var feature = _t.vw.MAP.editLayer.features[0];
    _t.vw.MAP.controls.edit.feature = feature;
    feature.geometry.x = 2;
    feature.geometry.y = 3;

    // Trigger modification.
    _t.vw.MAP.controls.edit.dragComplete();

    // "Coverage" should be updated.
    expect(el.coverage.val()).toEqual(
      'GEOMETRYCOLLECTION(POINT(2 3))'
    );

  });


  it('should update coverage on feature delete', function() {

    // --------------------------------------------------------------------
    // When an existing geometry is deleted, the coverage text area should
    // be updated with the new WKT string.
    // --------------------------------------------------------------------

    // Edit feature, set new point coords.
    var feature = _t.vw.MAP.editLayer.features[0];

    // Trigger modification.
    _t.vw.MAP.controls.remove.selectFeature(feature);

    // "Coverage" should be updated.
    expect(el.coverage.val()).toEqual('');

  });


  it('should remove all features on reset', function() {

    // --------------------------------------------------------------------
    // When the "Clear all Geometry" button is clicked, all features on
    // the edit layer should be deleted.
    // --------------------------------------------------------------------

    // Click "Clear all Geometry".
    el.clear.trigger('click');

    // All features should be removed.
    expect(_t.vw.MAP.editLayer.features.length).toEqual(0);

    // "Coverage" should be updated.
    expect(el.coverage.val()).toEqual('');

  });


  it('should revert to "Navigate" mode when tab is closed', function() {

    // --------------------------------------------------------------------
    // The geometry editing controls should revert to "Navigate" mode when
    // the spatial tab is deactivated.
    // --------------------------------------------------------------------

    // Click "Spatial" tab.
    el.spatial.tab('show');

    // Activate "Draw Polygon".
    el.pan[0].checked = false; el.poly[0].checked = true;

    // Click "Text" tab.
    el.text.tab('show');

    // "Navigate" mode should be active.
    expect(_t.vw.SPATIAL.getEditMode()).toEqual('pan');

  });


});
