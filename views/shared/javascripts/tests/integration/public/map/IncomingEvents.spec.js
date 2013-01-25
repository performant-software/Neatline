
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for map reactions to events initiated elsewhere.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Incoming Events', function() {


  beforeEach(function() {
    _t.loadNeatline();
  });


  describe('map:focusById', function() {


    it('should focus on model features', function() {

      // ------------------------------------------------------------------
      // When the `map:focusById` event is triggered with the id of a
      // model that already has a corresponding layer on the map, the map
      // should immediately focus on the model without fetching new data.
      // ------------------------------------------------------------------

      // Get model with map layer.
      var model = _t.vw.map.layers[0].nModel;

      // Register the starting requests count.
      var requestCount = _t.server.requests.count;

      // Trigger map:focusById with the id.
      Neatline.execute('map:focusById', model.get('id'));

      // No request should have been issued.
      expect(_t.server.requests.count).toEqual(requestCount);

      // Map should focus.
      var c = _t.vw.map.map.getCenter();
      var z = _t.vw.map.map.getZoom();
      expect(c.lon).toEqual(100);
      expect(c.lat).toEqual(200);
      expect(z).toEqual(10);

    });


    it('should create layer for model without layer', function() {

      // ------------------------------------------------------------------
      // When the `map:focusById` event is triggered with the id of a
      // model that does not currently have a map layer, the model should
      // be requested from the server, a new layer should be constructed
      // on the map, and the map should focus on the layer's geometries.
      // ------------------------------------------------------------------

      var done = false;

      // At the start, 3 map layers
      expect(_t.vw.map.layers.length).toEqual(3);

      // Hook onto map:focused.
      Neatline.vent.on('map:focused', function() { done = true; });

      // Trigger map:focusById with an id that does not have a map layer.
      Neatline.execute('map:focusById', 999);

      // Respond to the GET request.
      var request = _t.respondLast200(_t.json.record.standard);
      waitsFor(function() { return done; });

      // Check request formation.
      expect(request.method).toEqual('GET');
      expect(request.url).toEqual(__exhibit.api.record+'/999');

      // New layer should be created for model.
      expect(_t.vw.map.layers.length).toEqual(4);
      expect(_t.vw.map.layers[3].features[0].geometry.x).toEqual(1);
      expect(_t.vw.map.layers[3].features[0].geometry.y).toEqual(2);

      // Map should focus.
      var c = _t.vw.map.map.getCenter();
      var z = _t.vw.map.map.getZoom();
      expect(c.lon).toEqual(100);
      expect(c.lat).toEqual(200);
      expect(z).toEqual(10);

    });


  });


  describe('map:focusByModel', function() {


    it('should focus on model features', function() {

      // ------------------------------------------------------------------
      // When the `map:focusByModel` event is triggered with a model that
      // already has a corresponding layer on the map, the map should
      // immediately focus on the model without fetching new data.
      // ------------------------------------------------------------------

      // Get model with map layer.
      var model = _t.vw.map.layers[0].nModel;

      // Register the starting requests count.
      var requestCount = _t.server.requests.count;

      // Trigger map:focusById with the id.
      Neatline.execute('map:focusById', model);

      // No API request should have been spawned.
      expect(_t.server.requests.count).toEqual(requestCount);

      // Check focus and zoom.
      var c = _t.vw.map.map.getCenter();
      var z = _t.vw.map.map.getZoom();
      expect(c.lon).toEqual(100);
      expect(c.lat).toEqual(200);
      expect(z).toEqual(10);

    });


    it('should create layer for model without layer', function() {

      // ------------------------------------------------------------------
      // When the `map:focusByModel` event is triggered with a model that
      // does not currently have a map layer, the map should create a new
      // layer based on the passed model immediately focus on it without
      // fetching new data.
      // ------------------------------------------------------------------

      // Register the starting requests count.
      var requestCount = _t.server.requests.count;

      // At the start, 3 map layers
      expect(_t.vw.map.layers.length).toEqual(3);

      // Create a model that does not have a map layer.
      var model = _t.buildModelFromJson(_t.json.record.standard);

      // Trigger map:focusByModel.
      Neatline.execute('map:focusByModel', model);

      // No API request for new data.
      expect(_t.server.requests.count).toEqual(requestCount);

      // New layer should be created.
      expect(_t.vw.map.layers.length).toEqual(4);
      expect(_t.vw.map.layers[3].features[0].geometry.x).toEqual(1);
      expect(_t.vw.map.layers[3].features[0].geometry.y).toEqual(2);

      // Map should focus on model.
      var c = _t.vw.map.map.getCenter();
      var z = _t.vw.map.map.getZoom();
      expect(c.lon).toEqual(100);
      expect(c.lat).toEqual(200);
      expect(z).toEqual(10);

    });


  });


});
