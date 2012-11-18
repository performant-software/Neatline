
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

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

  // Load AJAX fixtures.
  var json = readFixtures('records.json');
  var jsonChangedData = readFixtures('records-changed-data.json');
  var jsonRemovedData = readFixtures('records-removed-data.json');

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

  describe('Data Rendering', function() {

    describe('Exhibit Defaults', function() {

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

    });

    describe('Record Data', function() {

      it('should render features for map-active models', function() {

        // Check geometry.
        expect(layers.length).toEqual(2);
        expect(layers[0].features[0].geometry.x).toEqual(-8233185.189506843);
        expect(layers[0].features[0].geometry.y).toEqual(4978802.273690212);
        expect(layers[1].features[0].geometry.x).toEqual(-7910926.6783014);
        expect(layers[1].features[0].geometry.y).toEqual(5214839.817002);

      });

      it('should not change data for frozen record', function() {

        console.log('before');
        // Trigger a map move, inject fixture.
        _t.map.map.events.triggerEvent('moveend');
        var request = _.last(server.requests);
        _t.respond200(request, jsonChangedData);
        console.log('after');

        // Check geometry.
        layers = _t.getVectorLayers();
        expect(layers.length).toEqual(2);
        expect(layers[1].features[0].geometry.x).toEqual(-7910926.6783014);
        expect(layers[1].features[0].geometry.y).toEqual(5214839.817002);

      });

      it('should not remove data for frozen record', function() {

      });

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
        toEqual('#444444');
      expect(layers[1].styleMap.styles.default.defaultStyle.strokeColor).
        toEqual('#555555');

      // Fill opacity
      expect(layers[0].styleMap.styles.default.defaultStyle.fillOpacity).
        toEqual(0.01);
      expect(layers[1].styleMap.styles.default.defaultStyle.fillOpacity).
        toEqual(0.02);

      // Stroke opacity
      expect(layers[0].styleMap.styles.default.defaultStyle.strokeOpacity).
        toEqual(0.07);
      expect(layers[1].styleMap.styles.default.defaultStyle.strokeOpacity).
        toEqual(0.08);

      // Graphic opacity
      expect(layers[0].styleMap.styles.default.defaultStyle.graphicOpacity).
        toEqual(0.1);
      expect(layers[1].styleMap.styles.default.defaultStyle.graphicOpacity).
        toEqual(0.11);

      // Stroke width.
      expect(layers[0].styleMap.styles.default.defaultStyle.strokeWidth).
        toEqual(13);
      expect(layers[1].styleMap.styles.default.defaultStyle.strokeWidth).
        toEqual(14);

      // Point radius.
      expect(layers[0].styleMap.styles.default.defaultStyle.pointRadius).
        toEqual(16);
      expect(layers[1].styleMap.styles.default.defaultStyle.pointRadius).
        toEqual(17);

      /*
       * Select:
       */

      // Fill color.
      expect(layers[0].styleMap.styles.select.defaultStyle.fillColor).
        toEqual('#777777');
      expect(layers[1].styleMap.styles.select.defaultStyle.fillColor).
        toEqual('#888888');

      // Stroke color.
      expect(layers[0].styleMap.styles.select.defaultStyle.strokeColor).
        toEqual('#444444');
      expect(layers[1].styleMap.styles.select.defaultStyle.strokeColor).
        toEqual('#555555');

      // Fill opacity
      expect(layers[0].styleMap.styles.select.defaultStyle.fillOpacity).
        toEqual(0.04);
      expect(layers[1].styleMap.styles.select.defaultStyle.fillOpacity).
        toEqual(0.05);

      // Stroke opacity
      expect(layers[0].styleMap.styles.select.defaultStyle.strokeOpacity).
        toEqual(0.07);
      expect(layers[1].styleMap.styles.select.defaultStyle.strokeOpacity).
        toEqual(0.08);

      // Graphic opacity
      expect(layers[0].styleMap.styles.select.defaultStyle.graphicOpacity).
        toEqual(0.1);
      expect(layers[1].styleMap.styles.select.defaultStyle.graphicOpacity).
        toEqual(0.11);

      // Stroke width.
      expect(layers[0].styleMap.styles.select.defaultStyle.strokeWidth).
        toEqual(13);
      expect(layers[1].styleMap.styles.select.defaultStyle.strokeWidth).
        toEqual(14);

      // Point radius.
      expect(layers[0].styleMap.styles.select.defaultStyle.pointRadius).
        toEqual(16);
      expect(layers[1].styleMap.styles.select.defaultStyle.pointRadius).
        toEqual(17);

      /*
       * Temporary:
       */

      // Fill color.
      expect(layers[0].styleMap.styles.temporary.defaultStyle.fillColor).
        toEqual('#777777');
      expect(layers[1].styleMap.styles.temporary.defaultStyle.fillColor).
        toEqual('#888888');

      // Stroke color.
      expect(layers[0].styleMap.styles.temporary.defaultStyle.strokeColor).
        toEqual('#444444');
      expect(layers[1].styleMap.styles.temporary.defaultStyle.strokeColor).
        toEqual('#555555');

      // Fill opacity
      expect(layers[0].styleMap.styles.temporary.defaultStyle.fillOpacity).
        toEqual(0.01);
      expect(layers[1].styleMap.styles.temporary.defaultStyle.fillOpacity).
        toEqual(0.02);

      // Stroke opacity
      expect(layers[0].styleMap.styles.temporary.defaultStyle.strokeOpacity).
        toEqual(0.07);
      expect(layers[1].styleMap.styles.temporary.defaultStyle.strokeOpacity).
        toEqual(0.08);

      // Graphic opacity
      expect(layers[0].styleMap.styles.temporary.defaultStyle.graphicOpacity).
        toEqual(0.1);
      expect(layers[1].styleMap.styles.temporary.defaultStyle.graphicOpacity).
        toEqual(0.11);

      // Stroke width.
      expect(layers[0].styleMap.styles.temporary.defaultStyle.strokeWidth).
        toEqual(13);
      expect(layers[1].styleMap.styles.temporary.defaultStyle.strokeWidth).
        toEqual(14);

      // Point radius.
      expect(layers[0].styleMap.styles.temporary.defaultStyle.pointRadius).
        toEqual(16);
      expect(layers[1].styleMap.styles.temporary.defaultStyle.pointRadius).
        toEqual(17);

    });

  });

  describe('Events', function() {

    describe('Outgoing', function() {

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

    });

    describe('Incoming', function() {

      it('should focus on model features on map:focus', function() {

        // Trigger map:focus on model with set focus/zoom.
        Neatline.vent.trigger('map:focus', layers[0].nModel);

        // Get focus and zoom.
        var center = _t.map.map.getCenter();
        var zoom = _t.map.map.getZoom();

        // Check focus and zoom.
        expect(Math.round(center.lat)).toEqual(4978802);
        expect(Math.round(center.lon)).toEqual(-8233185);
        expect(zoom).toEqual(10);

        // Trigger map:focus on model with no defaults.
        Neatline.vent.trigger('map:focus', layers[1].nModel);

        // Get focus and zoom.
        center = _t.map.map.getCenter();
        zoom = _t.map.map.getZoom();

        // Check focus and zoom.
        expect(Math.round(center.lat)).toEqual(5214840);
        expect(Math.round(center.lon)).toEqual(-7910927);
        expect(zoom).toEqual(18);

      });

    });

  });

});
