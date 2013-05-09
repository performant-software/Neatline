
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('WMS Layer Refreshing', function() {


  var fx = {
    original: read('PublicMapIncomingRefreshWmsLayers.original.json'),
    changed:  read('PublicMapIncomingRefreshWmsLayers.changed.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should clear and rebuild WMS layers', function() {

    // --------------------------------------------------------------------
    // The `MAP:refresh` command should completely wipe out all existing
    // WMS layers and reload records for the current viewport focus.
    // --------------------------------------------------------------------

    // Load default layers.
    NL.refreshMap(fx.original);

    // Should manifest original WMS data.
    var layers = NL.vw.MAP.getWmsLayers();
    expect(layers[0].url).toEqual('address1');
    expect(layers[0].params.LAYERS).toEqual('layers1');
    expect(layers[1].url).toEqual('address2');
    expect(layers[1].params.LAYERS).toEqual('layers2');
    expect(layers[2].url).toEqual('address3');
    expect(layers[2].params.LAYERS).toEqual('layers3');
    NL.assertWmsLayerCount(3);

    Neatline.vent.trigger('refresh');

    // Respond with changed coverage data.
    NL.respondLast200(fx.changed);
    var layers = NL.vw.MAP.getVectorLayers();

    // Should manifest changed WMS data.
    var layers = NL.vw.MAP.getWmsLayers();
    expect(layers[0].url).toEqual('address4');
    expect(layers[0].params.LAYERS).toEqual('layers4');
    expect(layers[1].url).toEqual('address5');
    expect(layers[1].params.LAYERS).toEqual('layers5');
    expect(layers[2].url).toEqual('address6');
    expect(layers[2].params.LAYERS).toEqual('layers6');
    NL.assertWmsLayerCount(3);

  });


});
