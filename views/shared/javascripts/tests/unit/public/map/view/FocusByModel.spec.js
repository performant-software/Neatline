
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Unit tests for `focusByModel` on the map view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map `focusByModel`', function() {

  var mapLayers;

  beforeEach(function() {

    _t.loadNeatline();

    // Get layers.
    mapLayers = _t.getVectorLayers();

  });

  it('should not change focus when coverage is POINT(0 0)', function() {

    // --------------------------------------------------------------------
    // When a model is passed to `focusByModel` with a coverage value of
    // "PONT(0 0)", the map should not change focus/zoom.
    // --------------------------------------------------------------------

    // Set focus/zoom.
    _t.setMapCenter(1, 2, 3)

    // Create a model with "empty" coverage.
    var model = new Neatline.Shared.Record.Model({
      coverage: 'POINT(0 0)',
      id: 999
    });

    // Focus, get center/zoom.
    _t.vw.map.focusByModel(model);
    var center  = _t.vw.map.map.getCenter();
    var zoom    = _t.vw.map.map.getZoom();

    // Unchanged center/zoom.
    expect(center.lon).toEqual(1);
    expect(center.lat).toEqual(2);
    expect(zoom).toEqual(3);

  });

});
