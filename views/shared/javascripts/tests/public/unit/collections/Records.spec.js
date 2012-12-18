
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record collection unit tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Collection', function() {

  beforeEach(function() {

    _t.loadNeatline();

    // Mock the API.
    __exhibit.api = '/api';
    __exhibit.id = 1;

  });

  it('should propagate model changes to all collections', function() {

    // --------------------------------------------------------------------
    // When any instance of Neatline.Models.Record is changed by way of a
    // call to `set`, all instances of Neatline.Collections.Records should
    // check to see if a model with the same id as the originally changed
    // model is present, and, if so, updated the local copy of the model.
    // This ensures that all instances of a model are kept up-to-date when
    // a model is changed in the editor. For example, when the title of a
    // record is changed in an edit form, the new title should immediately
    // manifest on the map, in the list of records, etc.
    // --------------------------------------------------------------------

    // Create two collections.
    var coll1 = new Neatline.Collections.Records();
    var coll2 = new Neatline.Collections.Records();

    // Populate with the same model.
    var model1 = coll1.create({ id: 1 });
    var model2 = coll2.create({ id: 1 });

    // Change model1.
    model1.set({ newAttr: 'val' });

    // Check for change on model2.
    expect(model2.get('newAttr')).toEqual('val');

  });

  describe('getCollection', function() {

    it('should issue GET request for updated records', function() {

      // ------------------------------------------------------------------
      // `getCollection` should merge the passed parameters into a default
      // object with the record id, call `fetch`, and pass in the supplied
      // callback the success handler.
      // ------------------------------------------------------------------

      var done = false;

      // Fetch success callback.
      var callback = function(coll) {
        expect(coll.length).toEqual(3);
        expect(coll.where({ title: 'title1' }).length).toEqual(1);
        expect(coll.where({ title: 'title2' }).length).toEqual(1);
        expect(coll.where({ title: 'title3' }).length).toEqual(1);
        done = true;
      };

      // Create a collection, update.
      var coll = new Neatline.Collections.Records();
      coll.getCollection({ key: 'val'}, callback);

      // Capture outoing GET request.
      var request = _t.getLastRequest();
      _t.respondLast200(_t.json.collections.standard);
      waitsFor(function() { return done; });

      // Check method and route.
      expect(request.method).toEqual('GET');
      expect(request.url).toEqual('/api?id=1&key=val');


    });

  });

  describe('getModel', function() {

    it('should return a model when one is present', function() {

      // ------------------------------------------------------------------
      // When `getModel` is called with the id for which there is already
      // a model in the collection, the model should be immediately passed
      // to the provided callback without any interaction with the server.
      // ------------------------------------------------------------------

      // Create a collection and a model.
      var coll = new Neatline.Collections.Records();
      var model = coll.create({ id: 1, key: 'val' });

      // Fetch success callback.
      var callback = function(model) {
        expect(model.get('id')).toEqual(1);
        expect(model.get('key')).toEqual('val');
        done = true;
      };

      // Get existing model.
      var c1 = _t.server.requests.length;
      coll.getModel(1, callback);
      var c2 = _t.server.requests.length;

      // No new request.
      expect(c2).toEqual(c1);

    });

    it('should fetch a new model when one is not present', function() {

      // ------------------------------------------------------------------
      // When `getModel` is called with the id for which no model exists
      // in the collection (for example, when an editor form is opened for
      // a record that is not currently visible on the map), a new model
      // should be created from the supplied id, fetched from the server,
      // and then passed to the supplied callback when it has data.
      // ------------------------------------------------------------------

      var done = false;

      // Create a collection.
      var coll = new Neatline.Collections.Records();

      // Fetch success callback.
      var callback = function(model) {
        expect(model.get('title')).toEqual('title4');
        done = true;
      };

      // Get absent model.
      coll.getModel(1, callback);

      // Capture outoing GET request.
      var request = _t.getLastRequest();
      _t.respondLast200(_t.json.records.standard);
      waitsFor(function() { return done; });

      // Check method and route.
      expect(request.method).toEqual('GET');
      expect(request.url).toEqual('/api/1');

    });

  });

  describe('updateModel', function() {

    it('should update a local model when one is present', function() {

      // ------------------------------------------------------------------
      // When a collection contains a model with the same `id` as the one
      // in the object passed to `updateModel`, the local model should be
      // updated with the passed object.
      // ------------------------------------------------------------------

      // Create a collection and a model.
      var coll = new Neatline.Collections.Records();
      coll.create({ id: 1 });

      // Update.
      coll.updateModel({ id: 1, key: 'val' });
      expect(coll.get(1).get('key')).toEqual('val');

    });

  });

});
