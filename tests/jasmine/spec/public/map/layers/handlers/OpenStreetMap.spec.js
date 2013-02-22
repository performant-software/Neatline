
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for the OpenStreetMap layer handler.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('OpenStreetMap Layer Handler', function() {


  beforeEach(function() {
    _t.loadNeatline();
  });


  it('should construct an OpenStreetMap layer', function() {

    var osm = Neatline.request('map:layers:OpenStreetMap', {
      title: 'Title'
    });

    expect(osm.CLASS_NAME).toEqual('OpenLayers.Layer.OSM');
    expect(osm.name).toEqual('Title');

  });


});
