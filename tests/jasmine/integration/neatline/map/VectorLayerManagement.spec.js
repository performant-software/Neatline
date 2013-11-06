
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Vector Layer Management', function() {


  var fixtures = {
    regular: read('NeatlineMapVectorLayerManagement.123.json'),
    updated: read('NeatlineMapVectorLayerManagement.34.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should load layers when exhibit starts', function() {

    // ------------------------------------------------------------------------
    // When the exhibit starts, the map should add vector layers for records
    // that arrive in the initial query.
    // ------------------------------------------------------------------------

    // Load records 1-3.
    NL.respondMap200(fixtures.regular);

    var layer1 = NL.getVectorLayer('title1');
    var layer2 = NL.getVectorLayer('title2');
    var layer3 = NL.getVectorLayer('title3');

    expect(layer1.features[0].geometry.x).toEqual(0);
    expect(layer1.features[0].geometry.y).toEqual(1);
    expect(layer2.features[0].geometry.x).toEqual(0);
    expect(layer2.features[0].geometry.y).toEqual(2);
    expect(layer3.features[0].geometry.x).toEqual(0);
    expect(layer3.features[0].geometry.y).toEqual(3);

    NL.assertVectorLayerCount(3);

  });


  it('should load layers when map is moved', function() {

    // ------------------------------------------------------------------------
    // New vector layers should be loaded when the map is moved.
    // ------------------------------------------------------------------------

    NL.triggerMapMoveEnd();

    // Load records 1-3.
    NL.respondLast200(fixtures.regular);

    var layer1 = NL.getVectorLayer('title1');
    var layer2 = NL.getVectorLayer('title2');
    var layer3 = NL.getVectorLayer('title3');
    var layer4 = NL.getVectorLayer('title4');

    expect(layer1).not.toBeUndefined();
    expect(layer2).not.toBeUndefined();
    expect(layer3).not.toBeUndefined();
    expect(layer4).toBeUndefined();

    expect(layer1.features[0].geometry.x).toEqual(0);
    expect(layer1.features[0].geometry.y).toEqual(1);
    expect(layer2.features[0].geometry.x).toEqual(0);
    expect(layer2.features[0].geometry.y).toEqual(2);
    expect(layer3.features[0].geometry.x).toEqual(0);
    expect(layer3.features[0].geometry.y).toEqual(3);

    NL.assertVectorLayerCount(3);

  });


  it('should add new layers / garbage collect stale layers', function() {

    // ------------------------------------------------------------------------
    // When the map is refreshed, new layers should be added for records that
    // were not present in the previous collection and layers for records that
    // are no longer in the collection should be removed.
    // ------------------------------------------------------------------------

    // Load records 1-3.
    NL.refreshMap(fixtures.regular);

    // Load records 3-4.
    NL.refreshMap(fixtures.updated);

    var layer1 = NL.getVectorLayer('title1');
    var layer2 = NL.getVectorLayer('title2');
    var layer3 = NL.getVectorLayer('title3');
    var layer4 = NL.getVectorLayer('title4');

    expect(layer1).toBeUndefined();     // Layer 1 garbage collected.
    expect(layer2).toBeUndefined();     // Layer 2 garbage collected.
    expect(layer3).not.toBeUndefined(); // Layer 3 unchanged.
    expect(layer4).not.toBeUndefined(); // Layer 4 added.

    expect(layer3.features[0].geometry.x).toEqual(0);
    expect(layer3.features[0].geometry.y).toEqual(3);
    expect(layer4.features[0].geometry.x).toEqual(0);
    expect(layer4.features[0].geometry.y).toEqual(4);

    NL.assertVectorLayerCount(2);

  });


  //it('should not garbage collect frozen layers', function() {

    //// ------------------------------------------------------------------------
    //// When the map is refreshed, vector layers associated with records that
    //// are not present in the new collection should _not_ be garbage collected
    //// if the `nFrozen` property is true.
    //// ------------------------------------------------------------------------

    //// Load collection with record 3.
    //NL.refreshMap(fixtures.regular);

    //// Freeze layer for record 3.
    //NL.getVectorLayer('title3').nFrozen = true;

    //// Load collection without record 3.
    //NL.refreshMap(fixtures.deleted);

    //// Should not remove frozen layer.
    //expect(NL.getVectorLayer('title3')).toBeDefined();
    //NL.assertVectorLayerCount(3);

  //});


});
