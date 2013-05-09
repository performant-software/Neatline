
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Vector Layer Refreshing', function() {


  var fx = {
    original: read('PublicMapIncomingRefreshVector.original.json'),
    changed:  read('PublicMapIncomingRefreshVector.changed.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should clear and rebuild vector layers', function() {

    // --------------------------------------------------------------------
    // The `MAP:refresh` command should completely wipe out all existing
    // vector layers and reload records for the current viewport focus.
    // --------------------------------------------------------------------

    // Load default layers.
    NL.refreshMap(fx.original);

    // Should manifest original vector data.
    var layers = NL.vw.MAP.getVectorLayers();
    expect(layers[0].features[0].geometry.x).toEqual(1);
    expect(layers[0].features[0].geometry.y).toEqual(2);
    expect(layers[1].features[0].geometry.x).toEqual(3);
    expect(layers[1].features[0].geometry.y).toEqual(4);
    expect(layers[2].features[0].geometry.x).toEqual(5);
    expect(layers[2].features[0].geometry.y).toEqual(6);
    NL.assertVectorLayerCount(3);

    Neatline.vent.trigger('refresh');

    // Respond with changed coverage data.
    NL.respondLast200(fx.changed);
    var layers = NL.vw.MAP.getVectorLayers();

    // Should manifest changed vector data.
    var layers = NL.vw.MAP.getVectorLayers();
    expect(layers[0].features[0].geometry.x).toEqual(7);
    expect(layers[0].features[0].geometry.y).toEqual(8);
    expect(layers[1].features[0].geometry.x).toEqual(9);
    expect(layers[1].features[0].geometry.y).toEqual(10);
    expect(layers[2].features[0].geometry.x).toEqual(11);
    expect(layers[2].features[0].geometry.y).toEqual(12);
    NL.assertVectorLayerCount(3);

  });


  it('should not rebuild frozen vector layers', function() {

    // --------------------------------------------------------------------
    // `MAP:refresh` should exclude frozen vector layers from refresh.
    // --------------------------------------------------------------------

    // Load default layers, freeze layer 2.
    NL.refreshMap(fx.original);
    NL.getVectorLayer('title2').nFrozen = true;

    Neatline.vent.trigger('refresh');

    // Respond with changed coverage data.
    NL.respondLast200(fx.changed);
    var layer = NL.getVectorLayer('title2');

    // Should not change layer 2 geometry.
    expect(layer.features[0].geometry.x).toEqual(3);
    expect(layer.features[0].geometry.y).toEqual(4);

  });


});
