
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Vector Zindex', function() {


  var fx = {
    records: read('NeatlineMapVectorZindex.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should apply `zindex` values', function() {

    // --------------------------------------------------------------------
    // The layer indices for vector layers should be set according to the
    // value of the `zindex` fields on the record models.
    // --------------------------------------------------------------------

    NL.respondMap200(fx.records);

    // Get the two vector layers.
    var layer1 = NL.getVectorLayer('title1');
    var layer2 = NL.getVectorLayer('title2');

    // Map should set layer indices.
    expect(NL.vw.MAP.map.getLayerIndex(layer1)).toEqual(1);
    expect(NL.vw.MAP.map.getLayerIndex(layer2)).toEqual(2);

  });


});
