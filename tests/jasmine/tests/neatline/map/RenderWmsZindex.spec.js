
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Render WMS Zindex', function() {


  var fixtures = {
    records: read('NeatlineMapRenderWmsZindex.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should apply `zindex` values', function() {

    // ------------------------------------------------------------------------
    // The layer indices for WMS layers should be set according to the value
    // of the `zindex` fields on the record models.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);

    // Get the WMS layers.
    var layer1 = NL.getWmsLayer('title1');
    var layer2 = NL.getWmsLayer('title2');
    var layer3 = NL.getWmsLayer('title3');

    // Get the indexes for the layers.
    var index1 = NL.v.map.map.getLayerIndex(layer1);
    var index2 = NL.v.map.map.getLayerIndex(layer2);
    var index3 = NL.v.map.map.getLayerIndex(layer3);

    // The map should apply the same relative difference between layer indexes
    // as the difference between the record `zindex` values.
    expect(index1).toBeGreaterThan(index2);
    expect(index2).toBeGreaterThan(index3);

  });


});
