
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
    mapLayers = _t.getVectorLayers();
  });


  it('should not change focus when coverage is `POINT(0 0)`', function() {

    // --------------------------------------------------------------------
    // When a model is passed to `focusByModel` with a coverage value of
    // "PONT(0 0)", the map should not change focus/zoom.
    // --------------------------------------------------------------------

    _t.setMapCenter(1, 2, 3)

    // Create a model with "empty" coverage.
    var model = new Neatline.Shared.Record.Model({
      id:         999,
      coverage:   'POINT(0 0)'
    });

    // Focus.
    _t.vw.map.focusByModel(model);
    var center  = _t.vw.map.map.getCenter();
    var zoom    = _t.vw.map.map.getZoom();

    // Unchanged center/zoom.
    expect(center.lon).toEqual(1);
    expect(center.lat).toEqual(2);
    expect(zoom).toEqual(3);

  });


  it('should zoom to extent when focus and zoom are null', function() {

    // --------------------------------------------------------------------
    // When a model is passed to `focusByModel` with null `map_focus` and
    // `map_zoom`, the map should auto-focus to the geometry extent.
    // --------------------------------------------------------------------

    _t.setMapCenter(0, 0, 1)

    // Create a model with "empty" coverage.
    var model = new Neatline.Shared.Record.Model({
      id:         999,
      coverage:   'POINT(1 1)',
      map_focus:  null,
      map_zoom:   null
    });

    // Focus.
    _t.vw.map.focusByModel(model);
    var center  = _t.vw.map.map.getCenter();
    var zoom    = _t.vw.map.map.getZoom();

    // Unchanged center/zoom.
    expect(center.lon).toEqual(1);
    expect(center.lat).toEqual(1);
    expect(zoom).toBeGreaterThan(1);

  });


});
