
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | WMS Layer Management', function() {


  var fixtures = {
    _1234: read('NeatlineMapWmsLayerManagement.1234.json'),
    _3456: read('NeatlineMapWmsLayerManagement.3456.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should load layers when exhibit starts', function() {

    // ------------------------------------------------------------------------
    // When the exhibit starts, the map should add WMS layers for records
    // that arrive in the initial query.
    // ------------------------------------------------------------------------

    // Load records 1-4.
    NL.respondMap200(fixtures._1234);

    var layer1 = NL.getWmsLayer('title1');
    var layer2 = NL.getWmsLayer('title2');
    var layer3 = NL.getWmsLayer('title3');
    var layer4 = NL.getWmsLayer('title4');
    var layer5 = NL.getWmsLayer('title5');
    var layer6 = NL.getWmsLayer('title6');

    expect(layer1).toBeDefined();
    expect(layer2).toBeDefined();
    expect(layer3).toBeDefined();
    expect(layer4).toBeDefined();
    expect(layer5).toBeUndefined();
    expect(layer6).toBeUndefined();

    expect(layer1.url).toEqual('address1');
    expect(layer1.params.LAYERS).toEqual('layers1');
    expect(layer2.url).toEqual('address2');
    expect(layer2.params.LAYERS).toEqual('layers2');
    expect(layer3.url).toEqual('address3');
    expect(layer3.params.LAYERS).toEqual('layers3');
    expect(layer4.url).toEqual('address4');
    expect(layer4.params.LAYERS).toEqual('layers4');

    NL.assertVectorLayerCount(4);

  });


  it('should update layers when the map is moved', function() {

    // ------------------------------------------------------------------------
    // When the map is refreshed, new layers should be added for records that
    // were not present in the previous collection and layers for records that
    // are no longer in the collection should be removed.
    // ------------------------------------------------------------------------

    // Load records 1-4.
    NL.refreshMap(fixtures._1234);

    // Move the map.
    NL.triggerMapMoveEnd();

    // Respond with records 3-6.
    NL.respondMap200(fixtures._3456);

    var layer1 = NL.getWmsLayer('title1');
    var layer2 = NL.getWmsLayer('title2');
    var layer3 = NL.getWmsLayer('title3');
    var layer4 = NL.getWmsLayer('title4');
    var layer5 = NL.getWmsLayer('title5');
    var layer6 = NL.getWmsLayer('title6');

    expect(layer1).toBeUndefined(); // Layer 1 garbage collected.
    expect(layer2).toBeUndefined(); // Layer 2 garbage collected.
    expect(layer3).toBeDefined();   // Layer 3 unchanged.
    expect(layer4).toBeDefined();   // Layer 4 unchanged.
    expect(layer5).toBeDefined();   // Layer 5 added.
    expect(layer6).toBeDefined();   // Layer 6 added.

    expect(layer3.url).toEqual('address3');
    expect(layer3.params.LAYERS).toEqual('layers3');
    expect(layer4.url).toEqual('address4');
    expect(layer4.params.LAYERS).toEqual('layers4');
    expect(layer5.url).toEqual('address5');
    expect(layer5.params.LAYERS).toEqual('layers5');
    expect(layer6.url).toEqual('address6');
    expect(layer6.params.LAYERS).toEqual('layers6');

    NL.assertVectorLayerCount(4);

  });


});
