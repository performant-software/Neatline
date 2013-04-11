
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


  beforeEach(function() {
    _t.loadNeatline();
  });


  it('should load layers when exhibit starts', function() {

    // --------------------------------------------------------------------
    // When the exhibit starts, the map should automatically load records
    // that fall within the default viewport.
    // --------------------------------------------------------------------

    _t.respondLast200(_t.json.MapVectorLayers.records.regular);
    var layers = _t.vw.MAP.getVectorLayers();

    expect(layers[0].features[0].geometry.x).toEqual(1);
    expect(layers[0].features[0].geometry.y).toEqual(2);
    expect(layers[1].features[0].geometry.x).toEqual(3);
    expect(layers[1].features[0].geometry.y).toEqual(4);
    expect(layers[2].features[0].geometry.x).toEqual(5);
    expect(layers[2].features[0].geometry.y).toEqual(6);
    _t.assertVectorLayerCount(3);

  });


  it('should load layers when map is moved', function() {

    // --------------------------------------------------------------------
    // When the map is panned or zoomed, a GET request should be emitted
    // to the records API with `extent` and `zoom` parameters.
    // --------------------------------------------------------------------

    _t.triggerMapMove();

    _t.respondLast200(_t.json.MapVectorLayers.records.regular);
    var layers = _t.vw.MAP.getVectorLayers();

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

    _t.refreshMap(_t.json.MapVectorLayers.records.deleted);
    _t.refreshMap(_t.json.MapVectorLayers.records.regular);

    expect(_t.getVectorLayerByTitle('title3')).toBeDefined();
    _t.assertVectorLayerCount(3);

  });


  it('should garbage collect stale layers', function() {

    // --------------------------------------------------------------------
    // When the map is refreshed, layers associated with records that are
    // no longer present in the collection  should be removed.
    // --------------------------------------------------------------------

    _t.refreshMap(_t.json.MapVectorLayers.records.regular);
    _t.refreshMap(_t.json.MapVectorLayers.records.deleted);

    expect(_t.getVectorLayerByTitle('title3')).toBeUndefined();
    _t.assertVectorLayerCount(2);

  });


  it('should not garbage collect frozen layers', function() {

    // --------------------------------------------------------------------
    // When the map is refreshed, existing layers associated with records
    // that are absent from the new collection should _not_ be removed if
    // the `nFrozen` property is true.
    // --------------------------------------------------------------------

    _t.refreshMap(_t.json.MapVectorLayers.records.regular);
    _t.getVectorLayerByTitle('title3').nFrozen = true;
    _t.refreshMap(_t.json.MapVectorLayers.records.deleted);

    expect(_t.getVectorLayerByTitle('title3')).toBeDefined();
    _t.assertVectorLayerCount(3);

  });


  it('should render styles', function() {

    // --------------------------------------------------------------------
    // Vector layer style maps should be constructed from record values.
    // --------------------------------------------------------------------

    _t.respondLast200(_t.json.MapVectorLayers.records.styles);
    var layer = _t.vw.MAP.getVectorLayers()[0];

    var def = layer.styleMap.styles['default'].defaultStyle;
    var tmp = layer.styleMap.styles.temporary.defaultStyle;
    var sel = layer.styleMap.styles.select.defaultStyle;

    expect(def.fillColor).        toEqual('1');
    expect(tmp.fillColor).        toEqual('2');
    expect(sel.fillColor).        toEqual('2');

    expect(def.strokeColor).      toEqual('3');
    expect(tmp.strokeColor).      toEqual('3');
    expect(sel.strokeColor).      toEqual('3');

    expect(def.fillOpacity).      toEqual(0.04);
    expect(tmp.fillOpacity).      toEqual(0.05);
    expect(sel.fillOpacity).      toEqual(0.05);

    expect(def.graphicOpacity).   toEqual(0.04);
    expect(tmp.graphicOpacity).   toEqual(0.05);
    expect(sel.graphicOpacity).   toEqual(0.05);

    expect(def.strokeOpacity).    toEqual(0.06);
    expect(tmp.strokeOpacity).    toEqual(0.06);
    expect(sel.strokeOpacity).    toEqual(0.06);

    expect(def.strokeWidth).      toEqual(7);
    expect(tmp.strokeWidth).      toEqual(7);
    expect(sel.strokeWidth).      toEqual(7);

    expect(def.pointRadius).      toEqual(8);
    expect(tmp.pointRadius).      toEqual(8);
    expect(sel.pointRadius).      toEqual(8);

    expect(def.externalGraphic).  toEqual('9');
    expect(tmp.externalGraphic).  toEqual('9');
    expect(sel.externalGraphic).  toEqual('9');

  });


});
