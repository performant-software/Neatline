
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


  beforeEach(function() {
    _t.loadNeatline();
  });


  it('should apply focus/zoom defaults when they exist', function() {

    _t.setMapCenter(0, 0, 1)

    var model = new Neatline.Shared.Record.Model({
      id:         999,
      map_focus:  '1,1',
      map_zoom:   2
    });

    // Focus.
    _t.vw.map.focusByModel(model);
    var center  = _t.vw.map.map.getCenter();
    var zoom    = _t.vw.map.map.getZoom();

    // Changed focus/zom.
    expect(center.lon).toEqual(1);
    expect(center.lat).toEqual(1);
    expect(zoom).toEqual(2);

  });


  it('should zoom to extent when focus/zoom are undefined', function() {

    _t.setMapCenter(0, 0, 1)

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

    // Changed focus/zom.
    expect(center.lon).toEqual(1);
    expect(center.lat).toEqual(1);
    expect(zoom).toBeGreaterThan(1);

  });


  it('should do nothing when coverage is `POINT(0 0)`', function() {

    _t.setMapCenter(1, 2, 3)

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


});
