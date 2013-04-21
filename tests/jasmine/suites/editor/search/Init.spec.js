
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Search Initialization', function() {


  var perPage;


  beforeEach(function() {
    NL.loadEditor();
    perPage = Neatline.globals.page_length;
  });


  describe('should populate search box with query', function() {

    // --------------------------------------------------------------------
    // When a route that defines a search query is requested, the search
    // query should be populated in the input and parsed.
    // --------------------------------------------------------------------

    it('single-word query', function() {
      NL.navigate('records/search/query=word');
      expect(NL.vw.SEARCH.__ui.search).toHaveValue('word');
    });

    it('multiple-word query', function() {
      NL.navigate('records/search/query=word1+word2');
      expect(NL.vw.SEARCH.__ui.search).toHaveValue('word1 word2');
    });

    it('tags query', function() {
      NL.navigate('records/search/query=tags:+tag1,+tag2');
      expect(NL.vw.SEARCH.__ui.search).toHaveValue('tags: tag1, tag2');
      expect(NL.vw.SEARCH.__ui.search).toHaveClass('bold');
    });

    it('map-mirror query', function() {
      NL.navigate('records/search/query=map:');
      expect(NL.vw.SEARCH.__ui.search).toHaveValue('map:');
      expect(NL.vw.SEARCH.__ui.search).toHaveClass('bold');
    });

  });


  it('should not load records when map mirroring is active', function() {

    // --------------------------------------------------------------------
    // When a route is requested with the map-mirroring search query, the
    // regular GET request for records should not be issued. This prevents
    // the map-synced record list from being overwritten by new records.
    // --------------------------------------------------------------------

    // Initialize with `map:` query.
    var c1 = NL.server.requests.length;
    NL.navigate('records/search/query=map:');
    var c2 = NL.server.requests.length;

    // No GET request.
    expect(c2).toEqual(c1);

  });


  describe('API requests', function() {


    afterEach(function() {

      NL.respondLast200(NL.json.SearchInit.records);
      var row = NL.getRecordListRows()[1];

      // Record list should be updated.
      expect($(row).find('.title')).toHaveText('title');

    });


    it('#', function() {

      NL.navigate('');

      // Should trigger GET request to /records.
      NL.assertLastRequestRoute(Neatline.globals.records_api);
      NL.assertLastRequestMethod('GET');

      // Default `limit` and `offset`.
      NL.assertLastRequestHasGetParameter('limit', perPage);
      NL.assertLastRequestHasGetParameter('offset', '0');

    });


    it('#records', function() {

      NL.navigate('records');

      // Should trigger GET request to /records.
      NL.assertLastRequestRoute(Neatline.globals.records_api);
      NL.assertLastRequestMethod('GET');

      // Default `limit` and `offset`.
      NL.assertLastRequestHasGetParameter('limit', perPage);
      NL.assertLastRequestHasGetParameter('offset', '0');

    });


    it('#records/search/start=X', function() {

      NL.navigate('records/search/start=10');

      // Should trigger GET request to /records.
      NL.assertLastRequestRoute(Neatline.globals.records_api);
      NL.assertLastRequestMethod('GET');

      // `offset`=10, default `limit`.
      NL.assertLastRequestHasGetParameter('limit', perPage);
      NL.assertLastRequestHasGetParameter('offset', '10');

    });


    it('#records/search/query=X', function() {

      NL.navigate('records/search/query=keywords');

      // Should trigger GET request to /records.
      NL.assertLastRequestRoute(Neatline.globals.records_api);
      NL.assertLastRequestMethod('GET');

      // `query`=keywords, `offset`=0, default `limit`.
      NL.assertLastRequestHasGetParameter('query', 'keywords');
      NL.assertLastRequestHasGetParameter('limit', perPage);
      NL.assertLastRequestHasGetParameter('offset', '0');

    });


    it('#records/search/query=tags:X,Y', function() {

      NL.navigate('records/search/query=tags:+tag1,+tag2');

      // Should trigger GET request to /records.
      NL.assertLastRequestRoute(Neatline.globals.records_api);
      NL.assertLastRequestMethod('GET');

      // `tags[]`=tag1, `tags[]`=tag2.
      var request = NL.getLastRequest();
      expect(request.url).toContain($.param({tags: ['tag1', 'tag2']}));

      // `offset`=0, default `limit`.
      NL.assertLastRequestHasGetParameter('limit', perPage);
      NL.assertLastRequestHasGetParameter('offset', '0');

    });


    it('#records/search/query=X/start=Y', function() {

      NL.navigate('records/search/query=keywords/start=10');

      // Should trigger GET request to /records.
      NL.assertLastRequestRoute(Neatline.globals.records_api);
      NL.assertLastRequestMethod('GET');

      // `query`=keywords, `offset`=10.
      NL.assertLastRequestHasGetParameter('query', 'keywords');
      NL.assertLastRequestHasGetParameter('limit', perPage);
      NL.assertLastRequestHasGetParameter('offset', '10');

    });


    it('#records/search/query=tags/start=X', function() {

      NL.navigate('records/search/query=tags:+tag1,+tag2/start=10');

      // Should trigger GET request to /records.
      NL.assertLastRequestRoute(Neatline.globals.records_api);
      NL.assertLastRequestMethod('GET');

      // `tags[]`=tag1, `tags[]`=tag2.
      var request = NL.getLastRequest();
      expect(request.url).toContain($.param({tags: ['tag1', 'tag2']}));

      // `offset`=0, default `limit`.
      NL.assertLastRequestHasGetParameter('limit', perPage);
      NL.assertLastRequestHasGetParameter('offset', '10');

    });

  });

});
