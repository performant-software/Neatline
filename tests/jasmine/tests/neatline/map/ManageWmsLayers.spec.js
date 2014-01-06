
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Manage WMS Layers', function() {


  var fixtures = {
    _1234: read('NeatlineMapManageWmsLayers.1234.json'),
    _3456: read('NeatlineMapManageWmsLayers.3456.json')
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

    var model1 = NL.v.map.records.findWhere({ title: 'title1' });
    var model2 = NL.v.map.records.findWhere({ title: 'title2' });
    var model3 = NL.v.map.records.findWhere({ title: 'title3' });
    var model4 = NL.v.map.records.findWhere({ title: 'title4' });
    var model5 = NL.v.map.records.findWhere({ title: 'title5' });
    var model6 = NL.v.map.records.findWhere({ title: 'title6' });

    var layer1 = NL.getWmsLayer('title1');
    var layer2 = NL.getWmsLayer('title2');
    var layer3 = NL.getWmsLayer('title3');
    var layer4 = NL.getWmsLayer('title4');
    var layer5 = NL.getWmsLayer('title5');
    var layer6 = NL.getWmsLayer('title6');

    // Should populate models.
    expect(model1).toBeDefined();
    expect(model2).toBeDefined();
    expect(model3).toBeDefined();
    expect(model4).toBeDefined();
    expect(model5).toBeUndefined();
    expect(model6).toBeUndefined();

    // Should add layers.
    expect(layer1).toBeDefined();
    expect(layer2).toBeDefined();
    expect(layer3).toBeDefined();
    expect(layer4).toBeDefined();
    expect(layer5).toBeUndefined();
    expect(layer6).toBeUndefined();

    // Should render WMS services.
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

    var model1 = NL.v.map.records.findWhere({ title: 'title1' });
    var model2 = NL.v.map.records.findWhere({ title: 'title2' });
    var model3 = NL.v.map.records.findWhere({ title: 'title3' });
    var model4 = NL.v.map.records.findWhere({ title: 'title4' });
    var model5 = NL.v.map.records.findWhere({ title: 'title5' });
    var model6 = NL.v.map.records.findWhere({ title: 'title6' });

    var layer1 = NL.getWmsLayer('title1');
    var layer2 = NL.getWmsLayer('title2');
    var layer3 = NL.getWmsLayer('title3');
    var layer4 = NL.getWmsLayer('title4');
    var layer5 = NL.getWmsLayer('title5');
    var layer6 = NL.getWmsLayer('title6');

    // Should update models.
    expect(model1).toBeUndefined(); // Record 1 removed.
    expect(model2).toBeUndefined(); // Record 2 removed
    expect(model3).toBeDefined();   // Record 3 unchanged.
    expect(model4).toBeDefined();   // Record 4 unchanged.
    expect(model5).toBeDefined();   // Record 5 added.
    expect(model6).toBeDefined();   // Reocrd 6 added.

    // Should add/remove layers.
    expect(layer1).toBeUndefined(); // Layer 1 removed.
    expect(layer2).toBeUndefined(); // Layer 2 removed.
    expect(layer3).toBeDefined();   // Layer 3 unchanged.
    expect(layer4).toBeDefined();   // Layer 4 unchanged.
    expect(layer5).toBeDefined();   // Layer 5 added.
    expect(layer6).toBeDefined();   // Layer 6 added.

    // Should render WMS services.
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


  it('should not double-render models that already have layers', function() {

    // ------------------------------------------------------------------------
    // If a record included in the list of new records from the server already
    // has a layer on the map, a second layer should not be created.
    // ------------------------------------------------------------------------

    // Load records 1-4 at start.
    NL.respondMap200(fixtures._1234);

    var layer1_1 = NL.getVectorLayer('title1');
    var layer2_1 = NL.getVectorLayer('title2');
    var layer3_1 = NL.getVectorLayer('title3');
    var layer4_1 = NL.getVectorLayer('title4');

    // Records 1-4 re-pushed.
    NL.refreshMap(fixtures._1234);

    var layer1_2 = NL.getVectorLayer('title1');
    var layer2_2 = NL.getVectorLayer('title2');
    var layer3_2 = NL.getVectorLayer('title3');
    var layer4_2 = NL.getVectorLayer('title4');

    // Still just 4 layers.
    NL.assertVectorLayerCount(4);

    // Layers should not be changed.
    expect(layer1_1.id).toEqual(layer1_2.id);
    expect(layer2_1.id).toEqual(layer2_2.id);
    expect(layer3_1.id).toEqual(layer3_2.id);
    expect(layer4_1.id).toEqual(layer4_2.id);

  });


});
