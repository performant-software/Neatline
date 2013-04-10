
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
    _t.respondAll200(_t.json.MapCursorEvents.records);

    // Get layer and feature.
    layer = _t.vw.MAP.getVectorLayers()[0];
    feature = layer.features[0];

    // Spy on the event aggregator.
    vent = spyOn(Neatline.vent, 'trigger').andCallThrough();

  });


  it('should render and publish feature hover', function() {

    _t.hoverOnMapFeature(feature);

    // Should render `temporary` intent.
    expect(feature.renderIntent).toEqual('temporary');

    // Should publish `MAP:highlight`.
    expect(vent).toHaveBeenCalledWith('MAP:highlight', layer.nModel);

  });


  it('should render and publish feature unhover', function() {

    _t.hoverOnMapFeature(feature);
    _t.unHoverOnMapFeature();

    // Should render `default` intent.
    expect(feature.renderIntent).toEqual('default');

    // Should publish `MAP:unhighlight`.
    expect(vent).toHaveBeenCalledWith('MAP:unhighlight', layer.nModel);

  });


  it('should render and publish feature select', function() {

    _t.clickOnMapFeature(feature);

    // Should render `select` intent.
    expect(feature.renderIntent).toEqual('select');

    // Should publish `MAP:select`.
    expect(vent).toHaveBeenCalledWith('MAP:select', layer.nModel);

  });


  it('should render and publish feature unselect', function() {

    _t.clickOnMapFeature(feature);
    _t.clickOffMapFeature();

    // Should render `default` intent.
    expect(feature.renderIntent).toEqual('default');

    // Should publish `MAP:unselect`.
    expect(vent).toHaveBeenCalledWith('MAP:unselect', layer.nModel);

  });


});
