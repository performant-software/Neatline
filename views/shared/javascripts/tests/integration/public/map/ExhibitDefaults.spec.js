
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


  it('should construct base layers');
  it('should set default base layers');


  it('should set exhibit default focus and zoom', function() {

    // --------------------------------------------------------------------
    // When the exhibit loads, the map should manifest the `map_focus` and
    // `map_zoom` parameters on the globals object.
    // --------------------------------------------------------------------

    loadFixtures('neatline-partial.html');

    // Set exhibit defaults.
    Neatline.global.map_focus = '1,2';
    Neatline.global.map_zoom = 10;

    // Start map.
    Neatline.Map.init();

    // Viewport should be set to default.
    var center = Neatline.Map.__view.map.getCenter();
    expect(Neatline.Map.__view.map.zoom).toEqual(10);
    expect(center.lon).toEqual(1);
    expect(center.lat).toEqual(2);

  });


});
