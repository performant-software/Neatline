
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for map WMS layer rendering.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map WMS Layers', function() {


  beforeEach(function() {
    _t.loadNeatline();
  });


  it('should load layers when exhibit starts', function() {

    // --------------------------------------------------------------------
    // When the exhibit starts, the map should construct WMS layers for
    // records with WMS data that arrive in the initial query. 
    // --------------------------------------------------------------------

    _t.respondMap200(_t.json.MapWmsLayers.records.regular);
    var layers = _t.vw.MAP.getWmsLayers();

    // Should create layers for records with WMS data.
    expect(layers[0].url).toEqual('address1');
    expect(layers[0].params.LAYERS).toEqual('layers1');
    expect(layers[1].url).toEqual('address2');
    expect(layers[1].params.LAYERS).toEqual('layers2');
    expect(layers[2].url).toEqual('address3');
    expect(layers[2].params.LAYERS).toEqual('layers3');
    _t.assertWmsLayerCount(3);

  });


  it('should load layers when map is moved', function() {

    // --------------------------------------------------------------------
    // New WMS layers should be loaded when the map is moved.
    // --------------------------------------------------------------------

    _t.triggerMapMove();

    _t.respondLast200(_t.json.MapWmsLayers.records.regular);
    var layers = _t.vw.MAP.getWmsLayers();

    // Should create layers for records with WMS data.
    expect(layers[0].url).toEqual('address1');
    expect(layers[0].params.LAYERS).toEqual('layers1');
    expect(layers[1].url).toEqual('address2');
    expect(layers[1].params.LAYERS).toEqual('layers2');
    expect(layers[2].url).toEqual('address3');
    expect(layers[2].params.LAYERS).toEqual('layers3');
    _t.assertWmsLayerCount(3);

  });


  it('should add new layers', function() {

    // --------------------------------------------------------------------
    // When the map is refreshed, new WMS layers should be created for
    // records with WMS data that were not present in the last collection.
    // --------------------------------------------------------------------

    // Load collection without record 3.
    _t.refreshMap(_t.json.MapWmsLayers.records.deleted);

    // Load collection with record 3.
    _t.refreshMap(_t.json.MapWmsLayers.records.regular);

    // Should create layer for record 3.
    expect(_t.getWmsLayerByTitle('title3')).toBeDefined();
    _t.assertWmsLayerCount(3);

  });


  it('should not rebuild existing layers', function() {

    // --------------------------------------------------------------------
    // When records are ingested that are already represented with WMS
    // layers, the existing layers should not be rebuilt.
    // --------------------------------------------------------------------

    _t.refreshMap(_t.json.MapWmsLayers.records.regular);

    // Store original OpenLayers id's.
    var olIds1 = _.map(_.values(_t.vw.MAP.layers.wms), function(v) {
      return v.id;
    });

    // Reload the same collection.
    _t.refreshMap(_t.json.MapWmsLayers.records.regular);

    // Get new OpenLayers id's.
    var olIds2 = _.map(_.values(_t.vw.MAP.layers.wms), function(v) {
      return v.id;
    });

    expect(olIds2).toEqual(olIds1);

  });


  it('should garbage collect stale layers', function() {

    // --------------------------------------------------------------------
    // When the map is refreshed, WMS layers associated with records that
    // are no longer present in the collection should be removed.
    // --------------------------------------------------------------------

    // Load collection with record 3.
    _t.refreshMap(_t.json.MapWmsLayers.records.regular);

    // Load collection without record 3.
    _t.refreshMap(_t.json.MapWmsLayers.records.deleted);

    // Should remove layer for record 3.
    expect(_t.getWmsLayerByTitle('title3')).toBeUndefined();
    _t.assertWmsLayerCount(2);

  });


});
