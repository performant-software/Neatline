
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
      pan:      _t.vw.record.__ui.spatial.pan,
      point:    _t.vw.record.__ui.spatial.point,
      line:     _t.vw.record.__ui.spatial.line,
      poly:     _t.vw.record.__ui.spatial.poly,
      regPoly:  _t.vw.record.__ui.spatial.regPoly,
      modify:   _t.vw.record.__ui.spatial.modify,
      remove:   _t.vw.record.__ui.spatial.remove,
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

    // Check "Draw Point."
    els.pan.removeAttr('checked');
    els.point.attr('checked', 'checked');
    els.point.trigger('change');

    // Check for control activation.
    expect(_t.vw.map.controls.point.active).toBeTruthy();

  });

  it('should set draw line mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Line" radio button is selected, the corresponding
    // drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Line."
    els.pan.removeAttr('checked');
    els.line.attr('checked', 'checked');
    els.line.trigger('change');

    // Check for control activation.
    expect(_t.vw.map.controls.line.active).toBeTruthy();

  });

  it('should set draw polygon mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Polygon" radio button is selected, the corresponding
    // drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Polygon."
    els.pan.removeAttr('checked');
    els.poly.attr('checked', 'checked');
    els.poly.trigger('change');

    // Check for control activation.
    expect(_t.vw.map.controls.poly.active).toBeTruthy();

  });

  it('should set draw regular polygon mode', function() {

    // --------------------------------------------------------------------
    // When the "Draw Regular Polygon" radio button is selected, the
    // corresponding drawFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Draw Polygon."
    els.pan.removeAttr('checked');
    els.regPoly.attr('checked', 'checked');
    els.regPoly.trigger('change');

    // Check for control activation.
    expect(_t.vw.map.controls.reg.active).toBeTruthy();

  });

  it('should set modify shape mode', function() {

    // --------------------------------------------------------------------
    // When the "Modify Shape" radio button is selected, the corresponding
    // modifyFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Modify Shape."
    els.pan.removeAttr('checked');
    els.modify.attr('checked', 'checked');
    els.modify.trigger('change');

    // Check for control activation.
    expect(_t.vw.map.controls.edit.active).toBeTruthy();

  });

  it('should set delete shape mode', function() {

    // --------------------------------------------------------------------
    // When the "Delete Shape" radio button is selected, the corresponding
    // modifyFeature control should be activated on the map.
    // --------------------------------------------------------------------

    // Check "Delete Shape."
    els.pan.removeAttr('checked');
    els.remove.attr('checked', 'checked');
    els.remove.trigger('change');

    // Check for control activation.
    expect(_t.vw.map.controls.del.active).toBeTruthy();

  });

  it('should set sides', function() {

    // --------------------------------------------------------------------
    // When a new value is entered into the "Sides" input, the `sides`
    // property on the modifyFeature control should be updated.
    // --------------------------------------------------------------------

    // Set sides.
    els.sides.val('10');
    els.sides.trigger('change');

    // Check settings.
    expect(_t.vw.map.controls.reg.handler.sides).toEqual(10);

  });

  it('should set snap angle', function() {

    // --------------------------------------------------------------------
    // When a new value is entered into the "Snap Angle" input, the
    // `snapAngle` property on the modifyFeature control should be updated.
    // --------------------------------------------------------------------

    // Set sides.
    els.snap.val('45');
    els.snap.trigger('change');

    // Check settings.
    expect(_t.vw.map.controls.reg.handler.snapAngle).toEqual(45);

  });

  it('should set irregular polygon', function() {

    // --------------------------------------------------------------------
    // When the "Irregular" checkbox is changed, the `irregular` property
    // on the modifyFeature control should be updated.
    // --------------------------------------------------------------------

    // Set irregular.
    els.irreg.attr('checked', 'checked');
    els.irreg.trigger('change');

    // Check settings.
    expect(_t.vw.map.controls.reg.handler.irregular).toEqual(true);

    // Unset irregular.
    els.irreg.removeAttr('checked');
    els.irreg.trigger('change');

    // Check settings.
    expect(_t.vw.map.controls.reg.handler.irregular).toEqual(false);

  });

  // it('should set rotation', function() {

  //   // --------------------------------------------------------------------
  //   // When the "Rotate" option under "Modify Shape" is checked, `ROTATE`
  //   // mode should be activated on the modifyFeature control.
  //   // --------------------------------------------------------------------

  //   // Set options.
  //   var rotate = $('input[name="modifyOptions"][value="rotate"]');
  //   rotate.attr('checked', 'checked');
  //   rotate.trigger('change');

  //   // Check settings.
  //   expect(_t.mapView.controls.edit.mode).toEqual(
  //     OpenLayers.Control.ModifyFeature.RESHAPE |
  //     OpenLayers.Control.ModifyFeature.ROTATE
  //   );

  // });

  // it('should set resize', function() {

  //   // --------------------------------------------------------------------
  //   // When the "Resize" option under "Modify Shape" is checked, `RESIZE`
  //   // mode should be activated on the modifyFeature control.
  //   // --------------------------------------------------------------------

  //   // Set options.
  //   var resize = $('input[name="modifyOptions"][value="resize"]');
  //   resize.attr('checked', 'checked');
  //   resize.trigger('change');

  //   // Check settings.
  //   expect(_t.mapView.controls.edit.mode).toEqual(
  //     OpenLayers.Control.ModifyFeature.RESHAPE |
  //     OpenLayers.Control.ModifyFeature.RESIZE
  //   );

  // });

  // it('should set drag', function() {

  //   // --------------------------------------------------------------------
  //   // When the "Drag" option under "Modify Shape" is checked, `DRAG` mode
  //   // should be activated on the modifyFeature control.
  //   // --------------------------------------------------------------------

  //   // Set options.
  //   var drag = $('input[name="modifyOptions"][value="drag"]');
  //   drag.attr('checked', 'checked');
  //   drag.trigger('change');

  //   // Check settings.
  //   expect(_t.mapView.controls.edit.mode).toEqual(
  //     OpenLayers.Control.ModifyFeature.RESHAPE |
  //     OpenLayers.Control.ModifyFeature.DRAG
  //   );

  // });

  // it('should update "Spatial Data" on point add', function() {

  //   // --------------------------------------------------------------------
  //   // When a new point geometry is added to the map, the "Spatial" text
  //   // area should be updated with the new WKT string.
  //   // --------------------------------------------------------------------

  //   // Create a new point, trigger modify.
  //   var pt = new OpenLayers.Geometry.Point(3,4);
  //   _t.mapView.controls.point.drawFeature(pt);

  //   // Check for new data.
  //   expect(_t.spatialTabView.coverage.val()).toEqual(
  //     'GEOMETRYCOLLECTION(POINT(1 2),POINT(3 4))'
  //   );

  // });

  // it('should update "Spatial Data" on line add', function() {

  //   // --------------------------------------------------------------------
  //   // When a new line geometry is added to the map, the "Spatial" text
  //   // area should be updated with the new WKT string.
  //   // --------------------------------------------------------------------

  //   // Create a new point, trigger modify.
  //   var pt1 = new OpenLayers.Geometry.Point(1,2);
  //   var pt2 = new OpenLayers.Geometry.Point(3,4);
  //   var line = new OpenLayers.Geometry.LineString([pt1,pt2]);
  //   _t.mapView.controls.line.drawFeature(line);

  //   // Check for new data.
  //   expect(_t.spatialTabView.coverage.val()).toEqual(
  //     'GEOMETRYCOLLECTION(POINT(1 2),LINESTRING(1 2,3 4))'
  //   );

  // });

  // it('should update "Spatial Data" on polygon add', function() {

  //   // --------------------------------------------------------------------
  //   // When a new polygon geometry is added to the map, the "Spatial" text
  //   // area should be updated with the new WKT string.
  //   // --------------------------------------------------------------------

  //   // Create a new point, trigger modify.
  //   var pt1 = new OpenLayers.Geometry.Point(1,2);
  //   var pt2 = new OpenLayers.Geometry.Point(3,4);
  //   var pt3 = new OpenLayers.Geometry.Point(5,6);
  //   var ring = new OpenLayers.Geometry.LinearRing([pt1,pt2,pt3]);
  //   var poly = new OpenLayers.Geometry.Polygon([ring]);
  //   _t.mapView.controls.poly.drawFeature(poly);

  //   // Check for new data.
  //   expect(_t.spatialTabView.coverage.val()).toEqual(
  //     'GEOMETRYCOLLECTION(POINT(1 2),POLYGON((1 2,3 4,5 6,1 2)))'
  //   );

  // });

  // it('should update "Spatial Data" on regular polygon add', function() {

  //   // --------------------------------------------------------------------
  //   // When a new regular polygon geometry is added to the map, the
  //   // "Spatial" text area should be updated with the new WKT string.
  //   // --------------------------------------------------------------------

  //   // Create a new point, trigger modify.
  //   var pt1 = new OpenLayers.Geometry.Point(1,2);
  //   var pt2 = new OpenLayers.Geometry.Point(3,4);
  //   var pt3 = new OpenLayers.Geometry.Point(5,6);
  //   var ring = new OpenLayers.Geometry.LinearRing([pt1,pt2,pt3]);
  //   var poly = new OpenLayers.Geometry.Polygon([ring]);
  //   _t.mapView.controls.reg.drawFeature(poly);

  //   // Check for new data.
  //   expect(_t.spatialTabView.coverage.val()).toEqual(
  //     'GEOMETRYCOLLECTION(POINT(1 2),POLYGON((1 2,3 4,5 6,1 2)))'
  //   );

  // });

  // it('should update "Spatial Data" on feature edit', function() {

  //   // --------------------------------------------------------------------
  //   // When an existing geometry is edited, the "Spatial" text area should
  //   // be updated with the new WKT string.
  //   // --------------------------------------------------------------------

  //   // Edit feature, set new point coords.
  //   var feature = _t.mapView.editLayer.features[0];
  //   _t.mapView.controls.edit.feature = feature;
  //   feature.geometry.x = 2;
  //   feature.geometry.y = 3;

  //   // Trigger modification.
  //   _t.mapView.controls.edit.dragComplete();

  //   // Check for new data.
  //   expect(_t.spatialTabView.coverage.val()).toEqual(
  //     'GEOMETRYCOLLECTION(POINT(2 3))'
  //   );

  // });

  // it('should update "Spatial Data" on feature delete', function() {

  //   // --------------------------------------------------------------------
  //   // When an existing geometry is deleted, the "Spatial" text area
  //   // should be updated with the new WKT string.
  //   // --------------------------------------------------------------------

  //   // Edit feature, set new point coords.
  //   var feature = _t.mapView.editLayer.features[0];

  //   // Trigger modification.
  //   _t.mapView.controls.del.selectFeature(feature);

  //   // Check for new data.
  //   expect(_t.spatialTabView.coverage.val()).toEqual(
  //     'GEOMETRYCOLLECTION()'
  //   );

  // });

});
