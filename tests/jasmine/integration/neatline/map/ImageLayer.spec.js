
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

    var layers  = NL.vw.MAP.map.getLayersBy('isBaseLayer', true);
    var layer   = NL.vw.MAP.map.baseLayer;

    // Base layer should be an image with the correct URL.
    expect(layer.CLASS_NAME).toEqual('OpenLayers.Layer.Image');
    expect(layer.url).toEqual(Neatline.g.neatline.exhibit.image_layer);

    // Should be just one layer.
    expect(layers.length).toEqual(1);

  });


});
