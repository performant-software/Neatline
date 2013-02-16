
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for map cursor events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Cursor Events', function() {


  var layer, feature, vent;


  beforeEach(function() {

    _t.loadNeatline();

    layer = _t.vw.map.layers[0];
    feature = layer.features[0];

    vent = spyOn(Neatline.vent, 'trigger').andCallThrough();

  });


  it('should render and publish feature hover', function() {

    // Hover on feature.
    _t.hoverOnMapFeature(feature);

    // Should render `temporary` intent.
    expect(feature.renderIntent).toEqual('temporary');

    // Should publish `map:highlight`.
    expect(vent).toHaveBeenCalledWith('map:highlight', layer.nModel);

  });


  it('should render and publish feature unhover', function() {

    // Unhover on feature.
    _t.hoverOnMapFeature(feature);
    _t.unHoverOnMapFeature();

    // Should render `default` intent.
    expect(feature.renderIntent).toEqual('default');

    // Should publish `map:unhighlight`.
    expect(vent).toHaveBeenCalledWith('map:unhighlight', layer.nModel);

  });


  it('should render and publish feature select', function() {

    // Click on feature.
    _t.clickOnMapFeature(feature);

    // Should render `select` intent.
    expect(feature.renderIntent).toEqual('select');

    // Should publish `map:select`.
    expect(vent).toHaveBeenCalledWith('map:select', layer.nModel);

  });


  it('should render and publish feature unselect', function() {

    // Click on feature, then off.
    _t.clickOnMapFeature(feature);
    _t.clickOffMapFeature();

    // Should render `default` intent.
    expect(feature.renderIntent).toEqual('default');

    // Should publish `map:unselect`.
    expect(vent).toHaveBeenCalledWith('map:unselect', layer.nModel);

  });


  it('should publish map move', function() {

    // Move the map.
    _t.refreshMap(_t.json.records.changed);

    // Get extent and zoom.
    var extent = _t.vw.map.getExtentAsWKT();
    var zoom = _t.vw.map.getZoom();

    // Should publish `map:move`.
    expect(vent.argsForCall[0][0]).toEqual('map:move');
    expect(vent.argsForCall[0][1].extent).toEqual(extent);
    expect(vent.argsForCall[0][1].zoom).toEqual(zoom);

  });


});
