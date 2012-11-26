
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Tests for event flows initiated by the map.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Outgoing Events', function() {

  var layers, layer, feature, server;

  // Load AJAX fixtures.
  var json = readFixtures('records.json');
  var jsonChangedData = readFixtures('records-changed-data.json');

  // Get fixtures.
  beforeEach(function() {

    // Load partial, mock server.
    loadFixtures('neatline-partial.html');
    server = sinon.fakeServer.create();

    // Run Neatline.
    _t.loadNeatline();

    // Intercept requests.
    _.each(server.requests, function(r) {
      _t.respond200(r, json);
    });

    // Get layer and feature.
    layers = _t.getVectorLayers(); layer = layers[0];
    feature = layer.features[0];

  });

  it('should render and publish feature hover', function() {

    // Spy on map:highlight.
    spyOn(Neatline.vent, 'trigger');

    // Clobber getFeaturesFromEvent().
    layer.getFeatureFromEvent = function(evt) { return feature; };

    // Mock cursor event.
    var evt = {
      xy: new OpenLayers.Pixel(Math.random(), Math.random()),
      type: 'mousemove'
    };

    // Trigger move.
    _t.map.map.events.triggerEvent('mousemove', evt);

    // Check render intent and publication.
    expect(feature.renderIntent).toEqual('temporary');
    expect(Neatline.vent.trigger).toHaveBeenCalledWith(
      'map:highlight', layer.nModel);

  });

  it('should render and publish feature unhover', function() {

    // Spy on map:highlight.
    spyOn(Neatline.vent, 'trigger');

    // Mock cursor event.
    var evt = {
      xy: new OpenLayers.Pixel(Math.random(), Math.random()),
      type: 'mousemove'
    };

    // Highlight the feature.
    // ----------------------

    // getFeaturesFromEvent() returns the mock feature.
    layer.getFeatureFromEvent = function(evt) { return feature; };

    // Trigger move.
    _t.map.map.events.triggerEvent('mousemove', evt);

    // Unhighlight the feature.
    // ------------------------

    // getFeaturesFromEvent() returns null.
    _.each(layers, function(layer) {
      layer.getFeatureFromEvent = function(evt) { return null; };
    });

    // Trigger move.
    _t.map.map.events.triggerEvent('mousemove', evt);

    // Check render intent and publication.
    expect(feature.renderIntent).toEqual('default');
    expect(Neatline.vent.trigger).toHaveBeenCalledWith(
      'map:unhighlight', layer.nModel);

  });

  it('should render and publish feature select', function() {

    // Spy on map:highlight.
    spyOn(Neatline.vent, 'trigger');

    // Clobber getFeaturesFromEvent().
    layer.getFeatureFromEvent = function(evt) { return feature; };

    // Mock cursor event.
    var evt = {
      xy: new OpenLayers.Pixel(Math.random(), Math.random()),
      type: 'click'
    };

    // Trigger click.
    _t.map.map.events.triggerEvent('click', evt);

    // Check render intent and publication.
    expect(feature.renderIntent).toEqual('select');
    expect(Neatline.vent.trigger).toHaveBeenCalledWith(
      'map:select', layer.nModel);

  });

  it('should render and publish feature unselect', function() {

    // Spy on map:highlight.
    spyOn(Neatline.vent, 'trigger');

    // Mock cursor event.
    var evt = {
      xy: new OpenLayers.Pixel(Math.random(), Math.random()),
      type: 'click'
    };

    // Highlight the feature.
    // ----------------------

    // getFeaturesFromEvent() returns the mock feature.
    layer.getFeatureFromEvent = function(evt) { return feature; };

    // Trigger click.
    _t.map.map.events.triggerEvent('click', evt);

    // Unhighlight the feature.
    // ------------------------

    // getFeaturesFromEvent() returns null.
    _.each(layers, function(layer) {
      layer.getFeatureFromEvent = function(evt) { return null; };
    });

    // Trigger move.
    _t.map.map.events.triggerEvent('click', evt);

    // Check render intent and publication.
    expect(feature.renderIntent).toEqual('default');
    expect(Neatline.vent.trigger).toHaveBeenCalledWith(
      'map:unselect', layer.nModel);

  });

  it('should publish map move', function() {

    // Spy on map:highlight.
    spyOn(Neatline.vent, 'trigger');

    // Trigger pan.
    _t.map.map.events.triggerEvent('moveend');

    // Check publication.
    expect(Neatline.vent.trigger).toHaveBeenCalledWith('map:move', {
      extent: _t.map.getExtentAsWKT(),
      zoom: _t.map.getZoom()
    });

  });

  it('should fetch new data on map move', function() {

    // Trigger pan, inject changed data.
    _t.map.map.events.triggerEvent('moveend');
    var request = _.last(server.requests);
    _t.respond200(request, jsonChangedData);

    // Check geometry.
    layers = _t.getVectorLayers();
    expect(layers[1].features[0].geometry.x).toEqual(3);
    expect(layers[1].features[0].geometry.y).toEqual(3);

  });

  it('should not publish map move when frozen', function() {

    // Spy on map:highlight.
    spyOn(Neatline.vent, 'trigger');

    // Trigger pan.
    _t.map.freeze();
    _t.map.map.events.triggerEvent('moveend');

    // Check for no publication.
    expect(Neatline.vent.trigger).not.toHaveBeenCalled();

  });

});
