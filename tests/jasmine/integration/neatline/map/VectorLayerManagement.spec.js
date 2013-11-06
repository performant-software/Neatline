
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Vector Layer Management', function() {


  var fixtures = {
    _1234: read('NeatlineMapVectorLayerManagement.1234.json'),
    _3456: read('NeatlineMapVectorLayerManagement.3456.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should load layers when exhibit starts', function() {

    // ------------------------------------------------------------------------
    // When the exhibit starts, the map should add vector layers for records
    // that arrive in the initial query.
    // ------------------------------------------------------------------------

    // Load records 1-4.
    NL.respondMap200(fixtures._1234);

    var layer1 = NL.getVectorLayer('title1');
    var layer2 = NL.getVectorLayer('title2');
    var layer3 = NL.getVectorLayer('title3');
    var layer4 = NL.getVectorLayer('title4');
    var layer5 = NL.getVectorLayer('title5');
    var layer6 = NL.getVectorLayer('title6');

    expect(layer1).not.toBeUndefined();
    expect(layer2).not.toBeUndefined();
    expect(layer3).not.toBeUndefined();
    expect(layer4).not.toBeUndefined();
    expect(layer5).toBeUndefined();
    expect(layer6).toBeUndefined();

    expect(layer1.features[0].geometry.x).toEqual(0);
    expect(layer1.features[0].geometry.y).toEqual(1);
    expect(layer2.features[0].geometry.x).toEqual(0);
    expect(layer2.features[0].geometry.y).toEqual(2);
    expect(layer3.features[0].geometry.x).toEqual(0);
    expect(layer3.features[0].geometry.y).toEqual(3);
    expect(layer4.features[0].geometry.x).toEqual(0);
    expect(layer4.features[0].geometry.y).toEqual(4);

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

    var layer1 = NL.getVectorLayer('title1');
    var layer2 = NL.getVectorLayer('title2');
    var layer3 = NL.getVectorLayer('title3');
    var layer4 = NL.getVectorLayer('title4');
    var layer5 = NL.getVectorLayer('title5');
    var layer6 = NL.getVectorLayer('title6');

    expect(layer1).toBeUndefined();     // Layer 1 garbage collected.
    expect(layer2).toBeUndefined();     // Layer 2 garbage collected.
    expect(layer3).not.toBeUndefined(); // Layer 3 unchanged.
    expect(layer4).not.toBeUndefined(); // Layer 4 unchanged.
    expect(layer5).not.toBeUndefined(); // Layer 5 added.
    expect(layer6).not.toBeUndefined(); // Layer 6 added.

    NL.assertVectorLayerCount(4);

  });


  it('should not garbage collect frozen layers', function() {

    // ------------------------------------------------------------------------
    // When the map is refreshed, vector layers associated with records that
    // are not present in the new collection should _not_ be garbage collected
    // if the `nFrozen` property is true.
    // ------------------------------------------------------------------------

    // Load records 1-4.
    NL.refreshMap(fixtures._1234);

    // Freeze record 1.
    NL.getVectorLayer('title1').nFrozen = true;

    // Load records 3-6.
    NL.refreshMap(fixtures._3456);

    // Should not remove frozen record 1.
    expect(NL.getVectorLayer('title1')).toBeDefined();
    NL.assertVectorLayerCount(5);

  });


});
