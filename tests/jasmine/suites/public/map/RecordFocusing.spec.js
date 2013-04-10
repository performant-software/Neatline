
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for map record focus commands.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Record Focusing', function() {


  beforeEach(function() {
    _t.loadNeatline();
    _t.respondAll200(_t.json.mapRecordFocusing);
  });


  describe('when a layer already exists for the record', function() {

    // --------------------------------------------------------------------
    // When the map focuses on a record that is already loaded on the map
    // when the command is issued, the map should immediately focus on the
    // record without fetching new data from the server.
    // --------------------------------------------------------------------

    var count, layer;

    beforeEach(function() {
      count = _t.server.requests.count;
      layer = _t.vw.MAP.getVectorLayers()[0];
    });

    afterEach(function() {

      // No request should have been issued.
      expect(_t.server.requests.count).toEqual(count);

      // Map should focus on record.
      _t.assertMapViewport(100, 200, 10);

    });

    it('focusByModel', function() {
      Neatline.execute('MAP:focusByModel', layer.nModel);
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
      var layers = _t.vw.MAP.getVectorLayers();
      expect(layers[3].features[0].geometry.x).toEqual(1);
      expect(layers[3].features[0].geometry.y).toEqual(2);
      expect(layers.length).toEqual(4);

      // Map should focus.
      _t.assertMapViewport(100, 200, 10);

    });

    it('focusByModel', function() {

      // Create a model that does not have a layer.
      var model = _t.buildRecordFromJson(_t.json.record.standard);
      var count = _t.server.requests.count;

      Neatline.execute('MAP:focusByModel', model);

      // Should not request data from server.
      expect(_t.server.requests.count).toEqual(count);

    });

    it('focusById', function() {

      var done = false;
      Neatline.vent.on('MAP:focused', function() { done = true; });
      Neatline.execute('MAP:focusById', 999);

      // Respond to the GET request.
      var request = _t.respondLast200(_t.json.record.standard);
      waitsFor(function() { return done; });

      // Should load record from server.
      expect(request.method).toEqual('GET');
      expect(request.url).toEqual(Neatline.global.records_api+'/999');

    });

  });


});
