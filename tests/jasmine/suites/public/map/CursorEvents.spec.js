
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
    exec = spyOn(Neatline, 'execute').andCallThrough();

  });


  it('should render and publish feature hover', function() {

    _t.hoverOnMapFeature(feature);

    // Should render `temporary` style.
    expect(feature.renderIntent).toEqual('temporary');

    // Should trigger `MAP:highlight` and `PRESENTER:show`.
    expect(vent).toHaveBeenCalledWith('MAP:highlight', layer.nModel);
    expect(exec).toHaveBeenCalledWith('PRESENTER:show', layer.nModel);

  });


  it('should render and publish feature unhover', function() {

    _t.hoverOnMapFeature(feature);
    _t.unHoverOnMapFeature();

    // Should render `default` style.
    expect(feature.renderIntent).toEqual('default');

    // Should trigger `MAP:unhighlight` and `PRESENTER:hide`.
    expect(vent).toHaveBeenCalledWith('MAP:unhighlight', layer.nModel);
    expect(exec).toHaveBeenCalledWith('PRESENTER:hide', layer.nModel);

  });


  it('should render and publish feature select', function() {

    _t.clickOnMapFeature(feature);

    // Should render `select` style.
    expect(feature.renderIntent).toEqual('select');

    // Should publish `MAP:select` and `PRESENTER:select`.
    expect(vent).toHaveBeenCalledWith('MAP:select', layer.nModel);
    expect(exec).toHaveBeenCalledWith('PRESENTER:select', layer.nModel);

  });


  it('should render and publish feature unselect', function() {

    _t.clickOnMapFeature(feature);
    _t.clickOffMapFeature();

    // Should render `default` style.
    expect(feature.renderIntent).toEqual('default');

    // Should publish `MAP:unselect` and `PRESENTER:unselect`.
    expect(vent).toHaveBeenCalledWith('MAP:unselect', layer.nModel);
    expect(exec).toHaveBeenCalledWith('PRESENTER:unselect', layer.nModel);

  });


  it('should issue GET request when map is moved', function() {

    _t.triggerMapMove();

    // Should trigger GET request to /records.
    _t.assertLastRequestRoute(Neatline.global.records_api);
    _t.assertLastRequestMethod('GET');

    // Should constrain by extent and zoom.
    _t.assertLastRequestHasGetParameter('extent');
    _t.assertLastRequestHasGetParameter('zoom');

  });


});
