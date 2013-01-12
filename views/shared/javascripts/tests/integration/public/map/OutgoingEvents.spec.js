
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for event flows initiated by the map.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Outgoing Events', function() {


  var layer, feature, spy;


  beforeEach(function() {

    _t.loadNeatline();

    layer   = _t.vw.map.layers[0];
    feature = layer.features[0];

    spy = spyOn(Neatline.vent, 'trigger').andCallThrough();

  });


  it('should render and publish feature hover', function() {

    // --------------------------------------------------------------------
    // When the cursor enters a map feature, the `map:highlight` event
    // should be triggered with the parent model of the feature.
    // --------------------------------------------------------------------

    // Hover on feature.
    _t.hoverOnMapFeature(layer, feature);

    // Should render `temporary` intent.
    expect(feature.renderIntent).toEqual('temporary');

    // Should publish `map:highlight`.
    expect(Neatline.vent.trigger).toHaveBeenCalledWith(
      'map:highlight', layer.nModel
    );

  });


  it('should render and publish feature unhover', function() {

    // --------------------------------------------------------------------
    // When the cursor leaves a map feature, the `map:unhighlight` event
    // should be triggered with the parent model of the feature.
    // --------------------------------------------------------------------

    // Simulate unhover on feature.
    _t.hoverOnMapFeature(layer, feature);
    _t.unHoverOnMapFeature(_t.vw.map.layers);

    // Should render `default` intent.
    expect(feature.renderIntent).toEqual('default');

    // Should publish `map:unhighlight`.
    expect(Neatline.vent.trigger).toHaveBeenCalledWith(
      'map:unhighlight', layer.nModel
    );

  });


  it('should render and publish feature select', function() {

    // --------------------------------------------------------------------
    // When a map feature is clicked on and selected, the `map:select`
    // event should be triggered with the parent model of the feature.
    // --------------------------------------------------------------------

    // Simulate click on feature.
    _t.clickOnMapFeature(layer, feature);

    // Should render `select` intent.
    expect(feature.renderIntent).toEqual('select');

    // Should publish `map:select`.
    expect(Neatline.vent.trigger).toHaveBeenCalledWith(
      'map:select', layer.nModel
    );

  });


  it('should render and publish feature unselect', function() {

    // --------------------------------------------------------------------
    // When a map feature is unselected with a click elsewhere on the map,
    // the `map:unhighlight` event should be triggered with the parent
    // model of the feature.
    // --------------------------------------------------------------------

    // Simulate click on feature.
    _t.clickOnMapFeature(layer, feature);

    // Simulate unhover on feature.
    _t.clickOffMapFeature(_t.vw.map.layers);

    // Should render `default` intent.
    expect(feature.renderIntent).toEqual('default');

    // Should publish `map:unselect`.
    expect(Neatline.vent.trigger).toHaveBeenCalledWith(
      'map:unselect', layer.nModel
    );

  });


  it('should publish map move', function() {

    // --------------------------------------------------------------------
    // When the map is panned or zoomed, the `map:move` event should be
    // triggered with the current extent and zoom of the viewport.
    // --------------------------------------------------------------------

    // Trigger pan.
    _t.refreshMap(_t.json.records.changed);

    // Get extent and zoom.
    var extent = _t.vw.map.getExtentAsWKT();
    var zoom = _t.vw.map.getZoom();

    // Should publish `map:move`.
    expect(spy.argsForCall[0][0]).toEqual('map:move');
    expect(spy.argsForCall[0][1].extent).toEqual(extent);
    expect(spy.argsForCall[0][1].zoom).toEqual(zoom);

  });


});
