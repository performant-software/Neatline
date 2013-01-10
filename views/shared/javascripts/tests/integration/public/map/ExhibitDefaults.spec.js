
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for default map state on initialization.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Exhibit Defaults', function() {

  it('should set exhibit default focus and zoom', function() {

    // --------------------------------------------------------------------
    // When the exhibit loads, the map should manifest the zoom and focus
    // set in `mapZoom` and `mapFocus` on the __exhibit global object.
    // --------------------------------------------------------------------

    // Load partial manually so that the __exhibit object can be modified
    // before the application is started.
    loadFixtures('neatline-partial.html');

    // Set exhibit defaults.
    __exhibit.map.zoom = 10;
    __exhibit.map.focus = '1,2';

    // Start map.
    Neatline.Map.init();

    // Check viewport.
    var center = Neatline.Map.__view.map.getCenter();
    expect(Neatline.Map.__view.map.zoom).toEqual(10);
    expect(center.lon).toEqual(1);
    expect(center.lat).toEqual(2);

  });

  // TODO: How to test geolocation?
  it('should geolocate and set zoom when no defaults');

});
