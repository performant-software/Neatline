
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
  });


  describe('when a layer already exists for the record', function() {

    // --------------------------------------------------------------------
    // When the map focuses on a record that is already loaded on the map
    // when the command is issued, the map should immediately focus on the
    // record without fetching new data from the server.
    // --------------------------------------------------------------------

    var count, layer;

    beforeEach(function() {

      // Inject starting record collection.
      _t.respondMap200(_t.json.MapRecordFocusing.records);

      // Get layer, cache request count.
      layer = _t.vw.MAP.getVectorLayers()[0];
      count = _t.server.requests.count;

    });

    afterEach(function() {

      // Should not load record from server.
      expect(_t.server.requests.count).toEqual(count);

      // Map should focus on record.
      _t.assertMapViewport(100, 200, 10);

    });

    it('select', function() {
      Neatline.vent.trigger('select', layer.nModel);
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
      var layer = _t.vw.MAP.getVectorLayers()[0];
      expect(layer.features[0].geometry.x).toEqual(1);
      expect(layer.features[0].geometry.y).toEqual(2);

      // Map should focus.
      _t.assertMapViewport(100, 200, 10);

    });

    it('select', function() {

      // Create a model that does not have a layer.
      var model = _t.recordFromJson(_t.json.MapRecordFocusing.record);
      var count = _t.server.requests.count;

      Neatline.vent.trigger('select', model);

      // Should not load record from server.
      expect(_t.server.requests.count).toEqual(count);

    });

    it('focusById', function() {

      var done = false;
      Neatline.vent.on('MAP:focused', function() { done = true; });
      Neatline.execute('MAP:focusById', 999);

      var request = _t.respondLast200(_t.json.MapRecordFocusing.record);
      waitsFor(function() { return done; });

      // Should load record from server.
      expect(request.method).toEqual('GET');
      expect(request.url).toEqual(Neatline.global.records_api+'/999');

    });

  });


});
