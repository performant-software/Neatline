
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
    _t.respondMap200(_t.json.MapCursorEvents.records);

    layer = _t.vw.MAP.getVectorLayers()[0];
    feature = layer.features[0];

    vent = spyOn(Neatline.vent, 'trigger').andCallThrough();

  });


  it('should render and publish feature highlight', function() {

    _t.hoverOnMapFeature(feature);

    // Should render `temporary` style.
    expect(feature.renderIntent).toEqual('temporary');

    // Should trigger `highlight`.
    expect(vent).toHaveBeenCalledWith('highlight', layer.nModel);

  });


  it('should render and publish feature unhighlight', function() {

    _t.hoverOnMapFeature(feature);
    _t.unHoverOnMapFeature();

    // Should render `default` style.
    expect(feature.renderIntent).toEqual('default');

    // Should trigger `unhighlight`.
    expect(vent).toHaveBeenCalledWith('unhighlight', layer.nModel);

  });


  it('should render and publish feature select', function() {

    _t.clickOnMapFeature(feature);

    // Should render `select` style.
    expect(feature.renderIntent).toEqual('select');

    // Should publish `select`.
    expect(vent).toHaveBeenCalledWith('select', layer.nModel);

  });


  it('should render and publish feature unselect', function() {

    _t.clickOnMapFeature(feature);
    _t.clickOffMapFeature();

    // Should render `default` style.
    expect(feature.renderIntent).toEqual('default');

    // Should publish `unselect`.
    expect(vent).toHaveBeenCalledWith('unselect', layer.nModel);

  });


  it('should issue GET request when map is moved', function() {

    _t.triggerMapMove();

    // Should trigger GET request to /records.
    _t.assertLastRequestRoute(Neatline.global.records_api);
    _t.assertLastRequestMethod('GET');

    // Should filter on extent and zoom.
    _t.assertLastRequestHasGetParameter('extent');
    _t.assertLastRequestHasGetParameter('zoom');

  });


});
