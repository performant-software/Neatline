
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Subscribe `refresh`', function() {


  var fixtures = {
    vector: {
      original: read('NeatlineMapSubscribeRefresh.vector.original.json'),
      changed:  read('NeatlineMapSubscribeRefresh.vector.changed.json')
    },
    wms: {
      original: read('NeatlineMapSubscribeRefresh.wms.original.json'),
      changed:  read('NeatlineMapSubscribeRefresh.wms.changed.json')
    }
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should clear and rebuild vector layers', function() {

    // ------------------------------------------------------------------------
    // The `MAP:refresh` command should completely clear all existing vector
    // layers and reload records for the current viewport focus.
    // ------------------------------------------------------------------------

    // Load default layers.
    NL.refreshMap(fixtures.vector.original);

    var layer1 = NL.getVectorLayer('title1');
    var layer2 = NL.getVectorLayer('title2');
    var layer3 = NL.getVectorLayer('title3');

    // Should manifest original vector data.
    expect(layer1.features[0].geometry.x).toEqual(1);
    expect(layer1.features[0].geometry.y).toEqual(2);
    expect(layer2.features[0].geometry.x).toEqual(3);
    expect(layer2.features[0].geometry.y).toEqual(4);
    expect(layer3.features[0].geometry.x).toEqual(5);
    expect(layer3.features[0].geometry.y).toEqual(6);
    NL.assertVectorLayerCount(3);

    Neatline.vent.trigger('refresh');

    // Respond with changed coverage data.
    NL.respondLast200(fixtures.vector.changed);

    var layer1 = NL.getVectorLayer('title1');
    var layer2 = NL.getVectorLayer('title2');
    var layer3 = NL.getVectorLayer('title3');

    // Should manifest changed vector data.
    expect(layer1.features[0].geometry.x).toEqual(7);
    expect(layer1.features[0].geometry.y).toEqual(8);
    expect(layer2.features[0].geometry.x).toEqual(9);
    expect(layer2.features[0].geometry.y).toEqual(10);
    expect(layer3.features[0].geometry.x).toEqual(11);
    expect(layer3.features[0].geometry.y).toEqual(12);
    NL.assertVectorLayerCount(3);

  });


  it('should clear and rebuild WMS layers', function() {

    // ------------------------------------------------------------------------
    // The `MAP:refresh` command should completely clear all existing WMS
    // layers and reload records for the current viewport focus.
    // ------------------------------------------------------------------------

    // Load default layers.
    NL.refreshMap(fixtures.wms.original);

    // Should manifest original WMS data.
    var layers = NL.v.map.getWmsLayers();
    expect(layers[0].url).toEqual('address1');
    expect(layers[0].params.LAYERS).toEqual('layers1');
    expect(layers[1].url).toEqual('address2');
    expect(layers[1].params.LAYERS).toEqual('layers2');
    expect(layers[2].url).toEqual('address3');
    expect(layers[2].params.LAYERS).toEqual('layers3');
    NL.assertWmsLayerCount(3);

    Neatline.vent.trigger('refresh');

    // Respond with changed coverage data.
    NL.respondLast200(fixtures.wms.changed);
    var layers = NL.v.map.getVectorLayers();

    // Should manifest changed WMS data.
    var layers = NL.v.map.getWmsLayers();
    expect(layers[0].url).toEqual('address4');
    expect(layers[0].params.LAYERS).toEqual('layers4');
    expect(layers[1].url).toEqual('address5');
    expect(layers[1].params.LAYERS).toEqual('layers5');
    expect(layers[2].url).toEqual('address6');
    expect(layers[2].params.LAYERS).toEqual('layers6');
    NL.assertWmsLayerCount(3);

  });


  it('should not rebuild frozen vector layers', function() {

    // ------------------------------------------------------------------------
    // `MAP:refresh` should exclude frozen vector layers from refresh.
    // ------------------------------------------------------------------------

    // Load default layers, freeze layer 2.
    NL.refreshMap(fixtures.vector.original);
    NL.getVectorLayer('title2').neatline.frozen = true;

    Neatline.vent.trigger('refresh');

    // Respond with changed coverage data.
    NL.respondLast200(fixtures.vector.changed);
    var layer2 = NL.getVectorLayer('title2');

    // Should not change layer 2 geometry.
    expect(layer2.features[0].geometry.x).toEqual(3);
    expect(layer2.features[0].geometry.y).toEqual(4);

  });


});
