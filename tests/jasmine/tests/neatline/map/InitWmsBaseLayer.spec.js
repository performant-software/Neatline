
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Initialize WMS Base Layer', function() {


  beforeEach(function() {
    NL.loadNeatline('NeatlineMapWmsBaseLayer.html');
  });


  it('should construct WMS base layer', function() {

    // ------------------------------------------------------------------------
    // When the WMS address/layers fields are defined on the exhibit, the map
    // should create a single WMS layer and set it as the base layer.
    // ------------------------------------------------------------------------

    var layers  = NL.v.map.map.getLayersBy('isBaseLayer', true);
    var layer   = NL.v.map.map.baseLayer;

    // Should create a WMS layer from the address/layers.
    expect(layer.CLASS_NAME).toEqual('OpenLayers.Layer.WMS');
    expect(layer.params.LAYERS).toEqual('layers');
    expect(layer.url).toEqual('address');

    // Should be just one layer.
    expect(layers.length).toEqual(1);

  });


});
