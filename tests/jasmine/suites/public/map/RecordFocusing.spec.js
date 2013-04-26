
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Record Focusing', function() {


  beforeEach(function() {
    NL.loadNeatline();
  });


  describe('when a layer already exists for the record', function() {

    // --------------------------------------------------------------------
    // When the map focuses on a record that is already loaded on the map
    // when the command is issued, the map should immediately focus on the
    // record without fetching new data from the server.
    // --------------------------------------------------------------------

    var count, layer;

    beforeEach(function() {

      NL.respondMap200(NL.json.MapRecordFocusing.records);

      // Get layer, cache request count.
      layer = NL.vw.MAP.getVectorLayers()[0];
      count = NL.server.requests.count;

    });

    afterEach(function() {

      // Should not load record from server.
      expect(NL.server.requests.count).toEqual(count);

      // Map should focus.
      NL.assertMapViewport(100, 200, 10);

    });

    it('select', function() {
      Neatline.vent.trigger('select', { model: layer.nModel });
    });

    it('focusById', function() {
      Neatline.execute('MAP:focusById', layer.nModel.id);
    });

  });


  describe('when a layer does not exist for the record', function() {

    // --------------------------------------------------------------------
    // When the map focuses on a record that is not loaded on the map when
    // the command is issued, the map should:
    //
    // - If an id is passed, the record should be fetched from the server
    // and rendered on the map; the map should focus on the new record.
    //
    // - If a model is passed, a new layer should be created immediately
    // from the model without any communication with the server.
    // --------------------------------------------------------------------

    afterEach(function() {

      // New layer should be created for model.
      var layer = NL.vw.MAP.getVectorLayers()[0];
      expect(layer.features[0].geometry.x).toEqual(1);
      expect(layer.features[0].geometry.y).toEqual(2);

      // Map should focus.
      NL.assertMapViewport(100, 200, 10);

    });

    it('select', function() {

      // Create a model that does not have a layer.
      var model = NL.recordFromJson(NL.json.MapRecordFocusing.record);
      var count = NL.server.requests.count;

      Neatline.vent.trigger('select', { model: model });

      // Should not load record from server.
      expect(NL.server.requests.count).toEqual(count);

    });

    it('focusById', function() {

      var done = false;
      Neatline.vent.on('MAP:focused', function() { done = true; });
      Neatline.execute('MAP:focusById', 999);

      var request = NL.respondLast200(NL.json.MapRecordFocusing.record);
      waitsFor(function() { return done; });

      // Should load record from server.
      expect(request.method).toEqual('GET');
      expect(request.url).toEqual(Neatline.global.records_api+'/999');

    });

  });


  describe('vector layers', function() {

    it('should not focus when vector layer is clicked', function() {

      // ------------------------------------------------------------------
      // When a map feature is clicked, the map should _not_ focus on the
      // record that corresponds to the clicked geometry. This prevents
      // disorienting leaps that can occur when the default zoom for the
      // clicked record is much higher or lower the current map zoom.
      // ------------------------------------------------------------------

      NL.respondMap200(NL.json.MapRecordFocusing.records);
      var feature = NL.vw.MAP.getVectorLayers()[0].features[0];

      // Set center and zoom.
      NL.setMapCenter(200, 300, 15);

      // Click on feature.
      NL.clickOnMapFeature(feature);

      // Focus should be unchanged.
      NL.assertMapViewport(200, 300, 15);

    });

  });


  describe('wms layers', function() {

    it('should not focus for model with WMS but no focus', function() {

      // ------------------------------------------------------------------
      // When a record is selected that has a WMS layer but no defined
      // focus or zoom, the map should _not_ focus, since the record will
      // have the generic coverage that covers the whole map, which, when
      // focused on, has the effect of zooming out to the highest level.
      // ------------------------------------------------------------------

      var model = NL.recordFromJson(
        NL.json.MapRecordFocusing.wms.noFocus
      );

      // Set center and zoom.
      NL.setMapCenter(200, 300, 15);

      // Select record with WMS layer, no focus.
      Neatline.vent.trigger('select', { model: model });

      // Map should not focus.
      NL.assertMapViewport(200, 300, 15);

    });


    it('should focus for model with WMS and focus', function() {

      // ------------------------------------------------------------------
      // When a record is selected that has a WMS layer and defined focus
      // and zoom values, the map should apply the defaults as usual.
      // ------------------------------------------------------------------

      var model = NL.recordFromJson(
        NL.json.MapRecordFocusing.wms.focus
      );

      // Set center and zoom.
      NL.setMapCenter(200, 300, 15);

      // Select record with WMS layer and focus.
      Neatline.vent.trigger('select', { model: model });

      // Map should focus.
      NL.assertMapViewport(100, 200, 10);

    });

  });


});
