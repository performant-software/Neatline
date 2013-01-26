
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


  beforeEach(function() {
    _t.loadEditor();
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


  describe('API requests', function() {


    afterEach(function() {

      // Inject a new JSON fixture.
      _t.respondLast200(_t.json.records.p6);
      var firstRecord = _t.getRecordRows()[1];

      // Confirm that the record list is updated to reflect the route.
      expect($(firstRecord).find('.title').text()).toEqual('Record5');

    });


    it('should load #', function() {

      _t.navigate('');

      // Should produce GET request to /records.
      _t.assertLastRequestRoute(__exhibit.api.records);
      _t.assertLastRequestMethod('GET');

      // Default `limit` and `offset`.
      _t.assertLastRequestHasGetParameter('limit', __editor.perPage);
      _t.assertLastRequestHasGetParameter('offset', '0');

    });


    it('should load #records', function() {

      _t.navigate('records');

      // Should produce GET request to /records.
      _t.assertLastRequestRoute(__exhibit.api.records);
      _t.assertLastRequestMethod('GET');

      // Default `limit` and `offset`.
      _t.assertLastRequestHasGetParameter('limit', __editor.perPage);
      _t.assertLastRequestHasGetParameter('offset', '0');

    });


    it('should load #records/search/start=X', function() {

      _t.navigate('records/search/start=10');

      // Should produce GET request to /records.
      _t.assertLastRequestRoute(__exhibit.api.records);
      _t.assertLastRequestMethod('GET');

      // `offset`=10, default `limit`.
      _t.assertLastRequestHasGetParameter('limit', __editor.perPage);
      _t.assertLastRequestHasGetParameter('offset', '10');

    });


    it('should load #records/search/query=keywords', function() {

      _t.navigate('records/search/query=keywords');

      // Should produce GET request to /records.
      _t.assertLastRequestRoute(__exhibit.api.records);
      _t.assertLastRequestMethod('GET');

      // `query`=keywords, `offset`=0, default `limit`.
      _t.assertLastRequestHasGetParameter('query', 'keywords');
      _t.assertLastRequestHasGetParameter('limit', __editor.perPage);
      _t.assertLastRequestHasGetParameter('offset', '0');

    });


    // it('#records/search/query=tags', function() {

    // });


    it('should load #records/search/query=keywords/start=X', function() {

      _t.navigate('records/search/query=keywords/start=10');

      // Should produce GET request to /records.
      _t.assertLastRequestRoute(__exhibit.api.records);
      _t.assertLastRequestMethod('GET');

      // `query`=keywords, `offset`=10.
      _t.assertLastRequestHasGetParameter('query', 'keywords');
      _t.assertLastRequestHasGetParameter('offset', '10');

    });


    // it('#records/search/query=tags/start=X', function() {

    // });

  });

});
