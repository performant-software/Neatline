
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Layers | XYZ', function() {


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should construct a WMS layer', function() {

    var xyz = Neatline.request('MAP:LAYERS:XYZ', {
      title: 'Title',
      properties: {
        urls: [
          'url1',
          'url2',
          'url3',
          'url4'
        ]
      }
    });

    expect(xyz.CLASS_NAME).toEqual('OpenLayers.Layer.XYZ');
    expect(xyz.name).toEqual('Title');

    expect(xyz.url).toEqual(['url1', 'url2', 'url3', 'url4']);

  });


});
