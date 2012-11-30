
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Tests for map reactions to events initiated elsewhere.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Incoming Events', function() {

  var server;

  // Load AJAX fixtures.
  var json = readFixtures('records.json');
  var jsonRecord = readFixtures('record.json');
  var jsonRecordInactive = readFixtures('record-inactive.json');

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

    // Get layers.
    layers = _t.getVectorLayers();

  });

  describe('map:focusById', function() {

    it('should focus on model features', function() {

      // Trigger map:focus on model with set focus/zoom.
      Neatline.vent.trigger('map:focusById', layers[0].nId);

      // Get focus and zoom.
      var center = _t.map.map.getCenter();
      var zoom = _t.map.map.getZoom();

      // Check focus and zoom.
      expect(Math.round(center.lon)).toEqual(100);
      expect(Math.round(center.lat)).toEqual(200);
      expect(zoom).toEqual(10);

      // Trigger map:focus on model with no defaults.
      Neatline.vent.trigger('map:focusById', layers[1].nId);

      // Get focus and zoom.
      center = _t.map.map.getCenter();
      zoom = _t.map.map.getZoom();

      // Check focus and zoom.
      expect(center.lon).toEqual(3);
      expect(center.lat).toEqual(4);
      expect(zoom).toEqual(18);

    });

    it('should create layer for absent model', function() {

      var done = false;

      // Hook onto map:focused.
      Neatline.vent.on('map:focused', function() {
        done = true;
      });

      // Check starting layers.
      expect(_t.map.layers.length).toEqual(2);

      // Trigger with absent id.
      var id = _.last(_t.records.models).get('id');
      Neatline.vent.trigger('map:focusById', id+1);

      // Plug in the fixture.
      _t.respond200(_.last(server.requests), jsonRecord);

      waitsFor(function() {
        return done;
      });

      // Check for new layer.
      layers = _t.getVectorLayers();
      expect(layers.length).toEqual(3);
      expect(layers[2].features[0].geometry.x).toEqual(6);
      expect(layers[2].features[0].geometry.y).toEqual(7);

    });

    it('should not create layer for absent inactive, model', function() {

      var done = false;

      // Hook onto map:focused.
      Neatline.vent.on('map:focused', function() {
        done = true;
      });

      // Check starting layers.
      expect(_t.map.layers.length).toEqual(2);

      // Trigger with absent id.
      var id = _.last(_t.records.models).get('id');
      Neatline.vent.trigger('map:focusById', id+1);

      // Plug in the fixture.
      var request = _.last(server.requests);
      _t.respond200(request, jsonRecordInactive);

      waitsFor(function() {
        return done;
      });

      // Check for new layer.
      layers = _t.getVectorLayers();
      expect(layers.length).toEqual(2);

    });

  });

  describe('map:focusByModel', function() {

    it('should focus on model features', function() {

      // Trigger map:focus on model with set focus/zoom.
      Neatline.vent.trigger('map:focusByModel', layers[0].nModel);

      // Get focus and zoom.
      var center = _t.map.map.getCenter();
      var zoom = _t.map.map.getZoom();

      // Check focus and zoom.
      expect(Math.round(center.lon)).toEqual(100);
      expect(Math.round(center.lat)).toEqual(200);
      expect(zoom).toEqual(10);

      // Trigger map:focus on model with no defaults.
      Neatline.vent.trigger('map:focusByModel', layers[1].nModel);

      // Get focus and zoom.
      center = _t.map.map.getCenter();
      zoom = _t.map.map.getZoom();

      // Check focus and zoom.
      expect(center.lon).toEqual(3);
      expect(center.lat).toEqual(4);
      expect(zoom).toEqual(18);

    });

    it('should create layer for absent model', function() {

      var done = false;

      // Hook onto map:focused.
      Neatline.vent.on('map:focused', function() {
        done = true;
      });

      // Check starting layers.
      expect(_t.map.layers.length).toEqual(2);

      // Trigger with absent model.
      var json = JSON.parse(jsonRecord);
      var model = new Neatline.Models.Record(json);
      Neatline.vent.trigger('map:focusByModel', model);

      waitsFor(function() {
        return done;
      });

      // Check for new layer.
      layers = _t.getVectorLayers();
      expect(layers.length).toEqual(3);
      expect(layers[2].features[0].geometry.x).toEqual(6);
      expect(layers[2].features[0].geometry.y).toEqual(7);

    });

    it('should not create layer for absent, inactive model', function() {

      var done = false;

      // Hook onto map:focused.
      Neatline.vent.on('map:focused', function() {
        done = true;
      });

      // Check starting layers.
      expect(_t.map.layers.length).toEqual(2);

      // Trigger with absent id.
      var json = JSON.parse(jsonRecordInactive);
      var model = new Neatline.Models.Record(json);
      Neatline.vent.trigger('map:focusByModel', model);

      // Plug in the fixture.
      var request = _.last(server.requests);
      _t.respond200(request, jsonRecordInactive);

      waitsFor(function() {
        return done;
      });

      // Check for no new layer.
      layers = _t.getVectorLayers();
      expect(layers.length).toEqual(2);

    });

  });

});
