
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search initialization tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Search Initialization', function() {


  var perPage;


  beforeEach(function() {
    _t.loadEditor();
    perPage = Neatline.global.page_length;
  });


  it('should populate search box with query', function() {

    // --------------------------------------------------------------------
    // When a route that defines a search query is requested, the search
    // query should be populated in the input and parsed.
    // --------------------------------------------------------------------

    // Single word query.
    _t.navigate('records/search/query=word');
    expect(_t.vw.search.__ui.search).toHaveValue('word');

    // Multiple-word query.
    _t.navigate('records/search/query=word1+word2');
    expect(_t.vw.search.__ui.search).toHaveValue('word1 word2');

    // Tags query.
    _t.navigate('records/search/query=tags:+tag1,+tag2');
    expect(_t.vw.search.__ui.search).toHaveValue('tags: tag1, tag2');
    expect(_t.vw.search.__ui.search).toHaveClass('bold');

    // Map query.
    _t.navigate('records/search/query=map:');
    expect(_t.vw.search.__ui.search).toHaveValue('map:');
    expect(_t.vw.search.__ui.search).toHaveClass('bold');

  });


  it('should not load records when map mirroring is active', function() {

    // --------------------------------------------------------------------
    // When a route is requested with the map-mirroring search query, the
    // regular GET request for records should not be issued. This prevents
    // the map-synced record list from being overwritten by new records.
    // --------------------------------------------------------------------

    // Initialize with `map:` query.
    var c1 = _t.server.requests.length;
    _t.navigate('records/search/query=map:');
    var c2 = _t.server.requests.length;
    expect(c2).toEqual(c1);

  });


  describe('API requests', function() {


    afterEach(function() {

      // Inject a new records collection.
      _t.respondLast200(_t.json.records.p6);
      var firstRecord = _t.getRecordRows()[1];

      // Record list should be updated.
      expect($(firstRecord).find('.title')).toHaveText('_Record0');

    });


    it('#', function() {

      _t.navigate('');

      // Should trigger GET request to /records.
      _t.assertLastRequestRoute(Neatline.global.records_api);
      _t.assertLastRequestMethod('GET');

      // Default `limit` and `offset`.
      _t.assertLastRequestHasGetParameter('limit', perPage);
      _t.assertLastRequestHasGetParameter('offset', '0');

    });


    it('#records', function() {

      _t.navigate('records');

      // Should trigger GET request to /records.
      _t.assertLastRequestRoute(Neatline.global.records_api);
      _t.assertLastRequestMethod('GET');

      // Default `limit` and `offset`.
      _t.assertLastRequestHasGetParameter('limit', perPage);
      _t.assertLastRequestHasGetParameter('offset', '0');

    });


    it('#records/search/start=X', function() {

      _t.navigate('records/search/start=10');

      // Should trigger GET request to /records.
      _t.assertLastRequestRoute(Neatline.global.records_api);
      _t.assertLastRequestMethod('GET');

      // `offset`=10, default `limit`.
      _t.assertLastRequestHasGetParameter('limit', perPage);
      _t.assertLastRequestHasGetParameter('offset', '10');

    });


    it('#records/search/query=X', function() {

      _t.navigate('records/search/query=keywords');

      // Should trigger GET request to /records.
      _t.assertLastRequestRoute(Neatline.global.records_api);
      _t.assertLastRequestMethod('GET');

      // `query`=keywords, `offset`=0, default `limit`.
      _t.assertLastRequestHasGetParameter('query', 'keywords');
      _t.assertLastRequestHasGetParameter('limit', perPage);
      _t.assertLastRequestHasGetParameter('offset', '0');

    });


    it('#records/search/query=tags:X,Y', function() {

      _t.navigate('records/search/query=tags:+tag1,+tag2');

      // Should trigger GET request to /records.
      _t.assertLastRequestRoute(Neatline.global.records_api);
      _t.assertLastRequestMethod('GET');

      // `tags[]`=tag1, `tags[]`=tag2.
      var request = _t.getLastRequest();
      expect(request.url).toContain($.param({tags: ['tag1', 'tag2']}));

      // `offset`=0, default `limit`.
      _t.assertLastRequestHasGetParameter('limit', perPage);
      _t.assertLastRequestHasGetParameter('offset', '0');

    });


    it('#records/search/query=X/start=Y', function() {

      _t.navigate('records/search/query=keywords/start=10');

      // Should trigger GET request to /records.
      _t.assertLastRequestRoute(Neatline.global.records_api);
      _t.assertLastRequestMethod('GET');

      // `query`=keywords, `offset`=10.
      _t.assertLastRequestHasGetParameter('query', 'keywords');
      _t.assertLastRequestHasGetParameter('limit', perPage);
      _t.assertLastRequestHasGetParameter('offset', '10');

    });


    it('#records/search/query=tags/start=X', function() {

      _t.navigate('records/search/query=tags:+tag1,+tag2/start=10');

      // Should trigger GET request to /records.
      _t.assertLastRequestRoute(Neatline.global.records_api);
      _t.assertLastRequestMethod('GET');

      // `tags[]`=tag1, `tags[]`=tag2.
      var request = _t.getLastRequest();
      expect(request.url).toContain($.param({tags: ['tag1', 'tag2']}));

      // `offset`=0, default `limit`.
      _t.assertLastRequestHasGetParameter('limit', perPage);
      _t.assertLastRequestHasGetParameter('offset', '10');

    });

  });

});
