
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Layers | OpenStreetMap', function() {


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should construct an OpenStreetMap layer', function() {

    var osm = Neatline.request('MAP:LAYERS:OpenStreetMap', {
      title: 'Title'
    });

    expect(osm.CLASS_NAME).toEqual('OpenLayers.Layer.OSM');
    expect(osm.name).toEqual('Title');

  });


});
