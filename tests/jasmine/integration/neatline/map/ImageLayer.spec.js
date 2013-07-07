
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Image Layer', function() {


  beforeEach(function() {
    NL.loadNeatline('NeatlineMapImageLayer.exhibit.html');
  });


  it('should construct image layer', function() {

    // --------------------------------------------------------------------
    // When an image URL is defined on the exhibit, the map should create
    // a layer from the image and set it as the base layer.
    // --------------------------------------------------------------------

    console.log(NL.vw.MAP.map.layers[0]);

  });


});
