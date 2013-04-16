
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for the WMS base layer handler constructor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('WMS Base Layer Constructor', function() {


  beforeEach(function() {
    _t.loadNeatline();
  });


  it('should construct a WMS layer', function() {

    var wms = Neatline.request('LAYERS:WMS', {
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
