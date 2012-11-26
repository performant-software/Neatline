
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Tests for default map state on initialization.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Exhibit Defaults', function() {

  var server;

  // Load AJAX fixtures.
  var json = readFixtures('records.json');

  // Get fixtures.
  beforeEach(function() {

    // Load partial, mock server.
    loadFixtures('neatline-partial.html');
    server = sinon.fakeServer.create();

    // Run Neatline.
    _t.loadNeatline();

    // Intercept requests.
    _.each(server.requests, function(r) {
      _t.respond200(r, json);
    });

  });

  it('should set exhibit default focus and zoom', function() {

    // Set exhibit defaults.
    __exhibit.mapZoom = 10;
    __exhibit.mapFocus = '-8031391.4348622, 5085508.3651615';

    // Restart.
    _t.loadNeatline();
    var request = _.last(server.requests);
    _t.respond200(request, json);

    // Check viewport.
    var center = _t.map.map.getCenter();
    expect(_t.map.map.zoom).toEqual(10);
    expect(center.lon).toEqual(-8031391.4348622);
    expect(center.lat).toEqual(5085508.3651615);

  });

  // TODO: How to test geolocation?
  it('should geolocate and set zoom when no defaults');

});
