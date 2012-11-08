/**
 * Integration tests for map viewport.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map', function() {

  var json = {
    status: 200, responseText: readFixtures('map-records.json')
  };

  // Get fixtures.
  beforeEach(function() {

    // Load partial, install ajax mock.
    loadFixtures('neatline-partial.html');
    jasmine.Ajax.useMock();

  });

  it('should set exhibit default focus and zoom', function() {

    // Set exhibit defaults.
    __exhibit.mapZoom = 10;
    __exhibit.mapFocus = '-8031391.4348622, 5085508.3651615';

    // Run Neatline.
    _t.loadNeatline();
    var request = mostRecentAjaxRequest();
    request.response(json);

    // Check viewport.
    var center = _t.map.map.getCenter();
    expect(_t.map.map.zoom).toEqual(10);
    expect(center.lon).toEqual(-8031391.4348622);
    expect(center.lat).toEqual(5085508.3651615);

  });

  it('should set a focus and zoom when no exhibit defaults', function() {

    // Set exhibit defaults.
    __exhibit.mapZoom = null;
    __exhibit.mapFocus = null;

    // Run Neatline.
    _t.loadNeatline();
    var request = mostRecentAjaxRequest();
    request.response(json);

    // Check viewport.
    expect(_t.map.map.zoom).toEqual(_t.map.options.defaultZoom);

    // TODO: How to check for geolocation?

  });

  it('should render features');

  it('should render styles');

  it('should render and publish feature hover');

  it('should render and publish feature unhover');

  it('should render and publish feature select');

  it('should render and publish feature unselect');

});
