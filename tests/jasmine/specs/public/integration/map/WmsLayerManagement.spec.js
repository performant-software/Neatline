
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('WMS Layer Management', function() {


  var fx = {
    regular: read('PublicMapWmsLayerManagement.regular.json'),
    deleted: read('PublicMapWmsLayerManagement.deleted.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should load layers when exhibit starts', function() {

    // --------------------------------------------------------------------
    // When the exhibit starts, the map should construct WMS layers for
    // records with WMS data that arrive in the initial query. 
    // --------------------------------------------------------------------

    NL.respondMap200(fx.regular);
    var layers = NL.vw.MAP.getWmsLayers();

    // Should create layers for records with WMS data.
    expect(layers[0].url).toEqual('address1');
    expect(layers[0].params.LAYERS).toEqual('layers1');
    expect(layers[1].url).toEqual('address2');
    expect(layers[1].params.LAYERS).toEqual('layers2');
    expect(layers[2].url).toEqual('address3');
    expect(layers[2].params.LAYERS).toEqual('layers3');
    NL.assertWmsLayerCount(3);

  });


  it('should load layers when map is moved', function() {

    // --------------------------------------------------------------------
    // New WMS layers should be loaded when the map is moved.
    // --------------------------------------------------------------------

    NL.triggerMapMoveEnd();

    NL.respondLast200(fx.regular);
    var layers = NL.vw.MAP.getWmsLayers();

    // Should create layers for records with WMS data.
    expect(layers[0].url).toEqual('address1');
    expect(layers[0].params.LAYERS).toEqual('layers1');
    expect(layers[1].url).toEqual('address2');
    expect(layers[1].params.LAYERS).toEqual('layers2');
    expect(layers[2].url).toEqual('address3');
    expect(layers[2].params.LAYERS).toEqual('layers3');
    NL.assertWmsLayerCount(3);

  });


  it('should add new layers', function() {

    // --------------------------------------------------------------------
    // When the map is refreshed, new WMS layers should be created for
    // records with WMS data that were absent from the last collection.
    // --------------------------------------------------------------------

    // Load collection without record 3.
    NL.refreshMap(fx.deleted);

    // Load collection with record 3.
    NL.refreshMap(fx.regular);

    // Should create layer for record 3.
    expect(NL.getWmsLayer('title3')).toBeDefined();
    NL.assertWmsLayerCount(3);

  });


  it('should not rebuild existing layers', function() {

    // --------------------------------------------------------------------
    // When records are ingested that are already represented with WMS
    // layers, the existing layers should not be rebuilt.
    // --------------------------------------------------------------------

    NL.refreshMap(fx.regular);

    // Store original OpenLayers id's.
    var olIds1 = _.map(_.values(NL.vw.MAP.layers.wms), function(v) {
      return v.id;
    });

    // Reload the same collection.
    NL.refreshMap(fx.regular);

    // Get new OpenLayers id's.
    var olIds2 = _.map(_.values(NL.vw.MAP.layers.wms), function(v) {
      return v.id;
    });

    expect(olIds2).toEqual(olIds1);

  });


  it('should garbage collect stale layers', function() {

    // --------------------------------------------------------------------
    // When the map is refreshed, WMS layers for with records that are no
    // longer present in the collection should be removed.
    // --------------------------------------------------------------------

    // Load collection with record 3.
    NL.refreshMap(fx.regular);

    // Load collection without record 3.
    NL.refreshMap(fx.deleted);

    // Should remove layer for record 3.
    expect(NL.getWmsLayer('title3')).toBeUndefined();
    NL.assertWmsLayerCount(2);

  });


});
