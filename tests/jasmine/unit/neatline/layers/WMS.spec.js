
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Layers | Web Map Service', function() {


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should construct a WMS layer', function() {

    var wms = Neatline.request('MAP:LAYERS:WMS', {
      title: 'Title',
      properties: {
        address: 'address',
        layers: 'layers'
      }
    });

    expect(wms.CLASS_NAME).toEqual('OpenLayers.Layer.WMS');
    expect(wms.name).toEqual('Title');

    expect(wms.params.LAYERS).toEqual('layers');
    expect(wms.url).toEqual('address');

  });


});
