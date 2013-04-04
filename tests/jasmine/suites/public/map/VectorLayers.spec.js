
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for map vector layer rendering.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Vector Layers', function() {


  var layers;


  beforeEach(function() {
    _t.loadNeatline();
    layers = _t.vw.MAP.getVectorLayers();
  });


  it('should query records API on pan/zoom', function() {

    // --------------------------------------------------------------------
    // When the map is panned or zoomed, a GET request should be emitted
    // to the records API with `extent` and `zoom` parameters.
    // --------------------------------------------------------------------

    _t.triggerMapMove();

    // Should issue GET request to records API.
    _t.assertLastRequestRoute(Neatline.global.records_api);
    _t.assertLastRequestMethod('GET');

    // Request should include map focus.
    _t.assertLastRequestHasGetParameter('extent');
    _t.assertLastRequestHasGetParameter('zoom');

  });


  it('should load layers when exhibit starts', function() {

    // --------------------------------------------------------------------
    // When the exhibit starts, the map should automatically load records
    // that fall within the default viewport.
    // --------------------------------------------------------------------

    expect(layers[0].features[0].geometry.x).toEqual(1);
    expect(layers[0].features[0].geometry.y).toEqual(2);
    expect(layers[1].features[0].geometry.x).toEqual(3);
    expect(layers[1].features[0].geometry.y).toEqual(4);
    expect(layers[2].features[0].geometry.x).toEqual(5);
    expect(layers[2].features[0].geometry.y).toEqual(6);
    _t.assertVectorLayerCount(3);

  });


  it('should add new layers', function() {

    // --------------------------------------------------------------------
    // When the map is refreshed, new layers should be created for records
    // that were not present in the last collection.
    // --------------------------------------------------------------------

    // Load records without record 2.
    _t.refreshMap(_t.json.records.removed);

    // Load records with record 2.
    _t.refreshMap(_t.json.records.standard);

    // Record 2 layer should be added.
    expect(_t.getVectorLayerByTitle('title2')).toBeDefined();
    _t.assertVectorLayerCount(3);

  });


  it('should garbage collect stale layers', function() {

    // --------------------------------------------------------------------
    // When the map is refreshed, layers for records that are no longer
    // present in the collection (either because they no longer intersect
    // the viewport or because they were deleted) - should be removed.
    // --------------------------------------------------------------------

    // Load records with record 2.
    _t.refreshMap(_t.json.records.standard);

    // Load records without record 2.
    _t.refreshMap(_t.json.records.removed);

    // Record 2 layer should be removed.
    expect(_t.getVectorLayerByTitle('title2')).toBeUndefined();
    _t.assertVectorLayerCount(2);

  });


  it('should not garbage collect frozen layers', function() {

    // --------------------------------------------------------------------
    // When the map is refreshed, existing layers associated with records
    // that are absent from the new collection should _not_ be removed if
    // the `neatline.frozen` option is true.
    // --------------------------------------------------------------------

    // Load records with record 2.
    _t.refreshMap(_t.json.records.standard);

    // Freeze record 2.
    _t.getVectorLayerByTitle('title2').options.neatline.frozen = true;

    // Load records without record 2.
    _t.refreshMap(_t.json.records.removed);

    // Record 2 layer should not be removed.
    expect(_t.getVectorLayerByTitle('title2')).toBeDefined();
    _t.assertVectorLayerCount(3);

  });


  it('should render styles', function() {

    var std = layers[0].styleMap.styles['default'].defaultStyle;
    var tmp = layers[0].styleMap.styles.temporary.defaultStyle;
    var sel = layers[0].styleMap.styles.select.defaultStyle;

    // Fill color.
    expect(std.fillColor).toEqual('#111111');
    expect(tmp.fillColor).toEqual('#222222');
    expect(sel.fillColor).toEqual('#222222');

    // Stroke color.
    expect(std.strokeColor).toEqual('#333333');
    expect(tmp.strokeColor).toEqual('#333333');
    expect(sel.strokeColor).toEqual('#333333');

    // Fill opacity.
    expect(std.fillOpacity).toEqual(0.04);
    expect(tmp.fillOpacity).toEqual(0.05);
    expect(sel.fillOpacity).toEqual(0.05);

    // Graphic opacity.
    expect(std.graphicOpacity).toEqual(0.04);
    expect(tmp.graphicOpacity).toEqual(0.05);
    expect(sel.graphicOpacity).toEqual(0.05);

    // Stroke opacity.
    expect(std.strokeOpacity).toEqual(0.06);
    expect(tmp.strokeOpacity).toEqual(0.06);
    expect(sel.strokeOpacity).toEqual(0.06);

    // Stroke width.
    expect(std.strokeWidth).toEqual(7);
    expect(tmp.strokeWidth).toEqual(7);
    expect(sel.strokeWidth).toEqual(7);

    // Point radius.
    expect(std.pointRadius).toEqual(8);
    expect(tmp.pointRadius).toEqual(8);
    expect(sel.pointRadius).toEqual(8);

  });


});
