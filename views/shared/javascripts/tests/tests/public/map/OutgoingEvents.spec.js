
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

  var mapLayers, layer, feature, spy;

  // Start Neatline.
  beforeEach(function() {

    _t.loadNeatline();

    // Get map layers.
    mapLayers = _t.getVectorLayers();

    // Get layer and feature.
    layer = mapLayers[0];
    feature = layer.features[0];

    // Spy on the event aggregator.
    spy = spyOn(Neatline.vent, 'trigger').andCallThrough();

  });

  it('should render and publish feature hover', function() {

    // --------------------------------------------------------------------
    // When the cursor enters a map feature, the `map:highlight` event
    // should be triggered with the parent model of the feature.
    // --------------------------------------------------------------------

    // Simulate hover on feature.
    _t.hoverOnMapFeature(layer, feature);

    // Check render intent.
    expect(feature.renderIntent).toEqual('temporary');

    // Check publication.
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
    _t.unHoverOnMapFeature(mapLayers);

    // Check render intent.
    expect(feature.renderIntent).toEqual('default');

    // Check publication
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

    // Check render intent.
    expect(feature.renderIntent).toEqual('select');

    // Check publication.
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
    _t.clickOffMapFeature(mapLayers);

    // Check render intent.
    expect(feature.renderIntent).toEqual('default');

    // Check publication
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
    _t.refreshMap(_t.json.collections.changed);

    // Get extent and zoom.
    var extent = _t.vw.map.getExtentAsWKT();
    var zoom = _t.vw.map.getZoom();

    // Check publication.
    expect(spy.argsForCall[0][0]).toEqual('map:move');
    expect(spy.argsForCall[0][1].extent).toEqual(extent);
    expect(spy.argsForCall[0][1].zoom).toEqual(zoom);

    // Check geometry.
    layers = _t.getVectorLayers();
    expect(layers[1].features[0].geometry.x).toEqual(7);
    expect(layers[1].features[0].geometry.y).toEqual(8);

  });

});
