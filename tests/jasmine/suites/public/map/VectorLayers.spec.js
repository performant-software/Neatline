
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
    // When the exhibit starts, the map should construct vector layers for
    // records that arrive in the initial query.
    // --------------------------------------------------------------------

    _t.respondMap200(_t.json.MapVectorLayers.records.regular);
    var layers = _t.vw.MAP.getVectorLayers();

    // Should create layers for records.
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
    // New vector layers should be loaded when the map is moved.
    // --------------------------------------------------------------------

    _t.triggerMapMove();

    _t.respondLast200(_t.json.MapVectorLayers.records.regular);
    var layers = _t.vw.MAP.getVectorLayers();

    // Should create layers for records.
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
    // When the map is refreshed, new vector layers should be created for
    // records that were not present in the last collection.
    // --------------------------------------------------------------------

    // Load collection without record 3.
    _t.refreshMap(_t.json.MapVectorLayers.records.deleted);

    // Load collection with record 3.
    _t.refreshMap(_t.json.MapVectorLayers.records.regular);

    // Should create layer for record 3.
    expect(_t.getVectorLayer('title3')).toBeDefined();
    _t.assertVectorLayerCount(3);

  });


  it('should not rebuild existing layers', function() {

    // --------------------------------------------------------------------
    // When records are ingested that are already represented with vector
    // layers, the existing layers should not be rebuilt.
    // --------------------------------------------------------------------

    _t.refreshMap(_t.json.MapVectorLayers.records.regular);

    // Store original OpenLayers id's.
    var olIds1 = _.map(_.values(_t.vw.MAP.layers.vector), function(v) {
      return v.id;
    });

    // Reload the same collection.
    _t.refreshMap(_t.json.MapVectorLayers.records.regular);

    // Get new OpenLayers id's.
    var olIds2 = _.map(_.values(_t.vw.MAP.layers.vector), function(v) {
      return v.id;
    });

    expect(olIds2).toEqual(olIds1);

  });


  it('should garbage collect stale layers', function() {

    // --------------------------------------------------------------------
    // When the map is refreshed, vector layers associated with records
    // that are no longer present in the collection should be removed.
    // --------------------------------------------------------------------

    // Load collection with record 3.
    _t.refreshMap(_t.json.MapVectorLayers.records.regular);

    // Load collection without record 3.
    _t.refreshMap(_t.json.MapVectorLayers.records.deleted);

    // Should remove layer for record 3.
    expect(_t.getVectorLayer('title3')).toBeUndefined();
    _t.assertVectorLayerCount(2);

  });


  it('should not garbage collect frozen layers', function() {

    // --------------------------------------------------------------------
    // When the map is refreshed, vector layers associated with records
    // that are absent from the new collection should _not_ be removed if
    // the `nFrozen` property is true.
    // --------------------------------------------------------------------

    // Load collection with record 3.
    _t.refreshMap(_t.json.MapVectorLayers.records.regular);

    // Freeze layer for record 3.
    _t.getVectorLayer('title3').nFrozen = true;

    // Load collection without record 3.
    _t.refreshMap(_t.json.MapVectorLayers.records.deleted);

    // Should not remove frozen layer.
    expect(_t.getVectorLayer('title3')).toBeDefined();
    _t.assertVectorLayerCount(3);

  });


  describe('style rendering', function() {

    var layer, feature;

    beforeEach(function() {

      _t.respondMap200(_t.json.MapVectorLayers.records.styles);

      layer = _t.vw.MAP.getVectorLayers()[0];
      feature = layer.features[0];

    });

    it('should build style maps', function() {

      // ------------------------------------------------------------------
      // Vector layer style maps should be constructed from record values.
      // ------------------------------------------------------------------

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

    it('should render `temporary` intent on highlight', function() {

      // ------------------------------------------------------------------
      // When the cursor hovers on a feature, the `temporary` style should
      // be applied to the geometry.
      // ------------------------------------------------------------------

      _t.hoverOnMapFeature(feature);

      expect(feature.renderIntent).toEqual('temporary');

    });

    it('should render `default` intent on unhighlight', function() {

      // ------------------------------------------------------------------
      // When the cursor hovers off a feature, the `default` style should
      // be applied to the geometry.
      // ------------------------------------------------------------------

      _t.hoverOnMapFeature(feature);
      _t.unHoverOnMapFeature();

      expect(feature.renderIntent).toEqual('default');

    });

    it('should render `select` intent on select', function() {

      // ------------------------------------------------------------------
      // When a feature is clicked, the `select` style should be applied
      // to the geometry.
      // ------------------------------------------------------------------

      _t.clickOnMapFeature(feature);

      expect(feature.renderIntent).toEqual('select');

    });

    it('should render `default` intent on unselect', function() {

      // ------------------------------------------------------------------
      // When a feature is unselected, the `default` style should be
      // applied to the geometry.
      // ------------------------------------------------------------------

      _t.clickOnMapFeature(feature);
      _t.clickOffMapFeature();

      expect(feature.renderIntent).toEqual('default');

    });

  });


});
