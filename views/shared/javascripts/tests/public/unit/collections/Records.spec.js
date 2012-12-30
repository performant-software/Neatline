
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
      var coll = new Neatline.Record.Collection();
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

});
