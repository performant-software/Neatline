/**
 * Unit tests for map viewport.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map', function() {

  var layers, layer, feature, server;
  var json = readFixtures('records.json');

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

  it('should set exhibit default focus and zoom', function() {

    // Set exhibit defaults.
    __exhibit.mapZoom = 10;
    __exhibit.mapFocus = '-8031391.4348622, 5085508.3651615';

    // Restart.
    _t.loadNeatline();
    var request = _.last(server.requests);
    _t.respond200(request, json);

    // Check viewport.
    var center = _t.map.map.getCenter();
    expect(_t.map.map.zoom).toEqual(10);
    expect(center.lon).toEqual(-8031391.4348622);
    expect(center.lat).toEqual(5085508.3651615);

  });

  it('should set a focus and zoom when no exhibit defaults', function() {

    // Set exhibit defaults.
    __exhibit.mapZoom = null;
    __exhibit.mapFocus = null;

    // Restart.
    _t.loadNeatline();
    var request = _.last(server.requests);
    _t.respond200(request, json);

    // Check viewport.
    expect(_t.map.map.zoom).toEqual(_t.map.options.defaultZoom);

    // TODO: How to check for geolocation?

  });

  it('should render features', function() {

    // Check geometry.
    expect(layers.length).toEqual(2);
    expect(layers[0].features[0].geometry.x).toEqual(-8233185.189506843);
    expect(layers[0].features[0].geometry.y).toEqual(4978802.273690212);
    expect(layers[1].features[0].geometry.x).toEqual(-7910926.6783014);
    expect(layers[1].features[0].geometry.y).toEqual(5214839.817002);

  });

  it('should render styles', function() {

    /*
     * Default:
     */

    // Fill color.
    expect(layers[0].styleMap.styles.default.defaultStyle.fillColor).
      toEqual('#111111');
    expect(layers[1].styleMap.styles.default.defaultStyle.fillColor).
      toEqual('#222222');

    // Stroke color.
    expect(layers[0].styleMap.styles.default.defaultStyle.strokeColor).
      toEqual('#333333');
    expect(layers[1].styleMap.styles.default.defaultStyle.strokeColor).
      toEqual('#444444');

    // Fill opacity
    expect(layers[0].styleMap.styles.default.defaultStyle.fillOpacity).
      toEqual(0.01);
    expect(layers[1].styleMap.styles.default.defaultStyle.fillOpacity).
      toEqual(0.02);

    // Stroke opacity
    expect(layers[0].styleMap.styles.default.defaultStyle.strokeOpacity).
      toEqual(0.05);
    expect(layers[1].styleMap.styles.default.defaultStyle.strokeOpacity).
      toEqual(0.06);

    // Graphic opacity
    expect(layers[0].styleMap.styles.default.defaultStyle.graphicOpacity).
      toEqual(0.07);
    expect(layers[1].styleMap.styles.default.defaultStyle.graphicOpacity).
      toEqual(0.08);

    // Stroke width.
    expect(layers[0].styleMap.styles.default.defaultStyle.strokeWidth).
      toEqual(9);
    expect(layers[1].styleMap.styles.default.defaultStyle.strokeWidth).
      toEqual(10);

    // Point radius.
    expect(layers[0].styleMap.styles.default.defaultStyle.pointRadius).
      toEqual(11);
    expect(layers[1].styleMap.styles.default.defaultStyle.pointRadius).
      toEqual(12);

    /*
     * Select:
     */

    // Fill color.
    expect(layers[0].styleMap.styles.select.defaultStyle.fillColor).
      toEqual('#555555');
    expect(layers[1].styleMap.styles.select.defaultStyle.fillColor).
      toEqual('#666666');

    // Stroke color.
    expect(layers[0].styleMap.styles.select.defaultStyle.strokeColor).
      toEqual('#333333');
    expect(layers[1].styleMap.styles.select.defaultStyle.strokeColor).
      toEqual('#444444');

    // Fill opacity
    expect(layers[0].styleMap.styles.select.defaultStyle.fillOpacity).
      toEqual(0.03);
    expect(layers[1].styleMap.styles.select.defaultStyle.fillOpacity).
      toEqual(0.04);

    // Stroke opacity
    expect(layers[0].styleMap.styles.select.defaultStyle.strokeOpacity).
      toEqual(0.05);
    expect(layers[1].styleMap.styles.select.defaultStyle.strokeOpacity).
      toEqual(0.06);

    // Graphic opacity
    expect(layers[0].styleMap.styles.select.defaultStyle.graphicOpacity).
      toEqual(0.07);
    expect(layers[1].styleMap.styles.select.defaultStyle.graphicOpacity).
      toEqual(0.08);

    // Stroke width.
    expect(layers[0].styleMap.styles.select.defaultStyle.strokeWidth).
      toEqual(9);
    expect(layers[1].styleMap.styles.select.defaultStyle.strokeWidth).
      toEqual(10);

    // Point radius.
    expect(layers[0].styleMap.styles.select.defaultStyle.pointRadius).
      toEqual(11);
    expect(layers[1].styleMap.styles.select.defaultStyle.pointRadius).
      toEqual(12);

    /*
     * Temporary:
     */

    // Fill color.
    expect(layers[0].styleMap.styles.temporary.defaultStyle.fillColor).
      toEqual('#555555');
    expect(layers[1].styleMap.styles.temporary.defaultStyle.fillColor).
      toEqual('#666666');

    // Stroke color.
    expect(layers[0].styleMap.styles.temporary.defaultStyle.strokeColor).
      toEqual('#333333');
    expect(layers[1].styleMap.styles.temporary.defaultStyle.strokeColor).
      toEqual('#444444');

    // Fill opacity
    expect(layers[0].styleMap.styles.temporary.defaultStyle.fillOpacity).
      toEqual(0.01);
    expect(layers[1].styleMap.styles.temporary.defaultStyle.fillOpacity).
      toEqual(0.02);

    // Stroke opacity
    expect(layers[0].styleMap.styles.temporary.defaultStyle.strokeOpacity).
      toEqual(0.05);
    expect(layers[1].styleMap.styles.temporary.defaultStyle.strokeOpacity).
      toEqual(0.06);

    // Graphic opacity
    expect(layers[0].styleMap.styles.temporary.defaultStyle.graphicOpacity).
      toEqual(0.07);
    expect(layers[1].styleMap.styles.temporary.defaultStyle.graphicOpacity).
      toEqual(0.08);

    // Stroke width.
    expect(layers[0].styleMap.styles.temporary.defaultStyle.strokeWidth).
      toEqual(9);
    expect(layers[1].styleMap.styles.temporary.defaultStyle.strokeWidth).
      toEqual(10);

    // Point radius.
    expect(layers[0].styleMap.styles.temporary.defaultStyle.pointRadius).
      toEqual(11);
    expect(layers[1].styleMap.styles.temporary.defaultStyle.pointRadius).
      toEqual(12);

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
    expect(Neatline.vent.trigger).toHaveBeenCalledWith('map:highlight');

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
    expect(Neatline.vent.trigger).toHaveBeenCalledWith('map:unhighlight');

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

    // Trigger move.
    _t.map.map.events.triggerEvent('click', evt);

    // Check render intent and publication.
    expect(feature.renderIntent).toEqual('select');
    expect(Neatline.vent.trigger).toHaveBeenCalledWith('map:select');

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

    // Trigger move.
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
    expect(Neatline.vent.trigger).toHaveBeenCalledWith('map:unselect');

  });

});
