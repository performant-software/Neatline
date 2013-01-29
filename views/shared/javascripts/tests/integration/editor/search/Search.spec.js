
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search execution tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Search', function() {


  beforeEach(function() {
    _t.loadEditor();
  });


  it('should bold the input when a tags query is entered', function() {

    // --------------------------------------------------------------------
    // When a search query that starts with `tags:` is entered, the input
    // should be bolded to indicate that the tags string is being parsed.
    // --------------------------------------------------------------------

    // Keyup with tag string in the box.
    _t.vw.search.__ui.search.val('tags: tag1, tag2');
    _t.vw.search.__ui.search.trigger('keyup');

    // Input should be bold.
    expect(_t.vw.search.__ui.search).toHaveClass('bold');

  });


  it('should bold the input when map mirroring is enabled', function() {

    // --------------------------------------------------------------------
    // When `map:` is entered, the input should be bolded to indicate that
    // the map mirroring has been activated.
    // --------------------------------------------------------------------

    // Keyup with `map:` in the box.
    _t.vw.search.__ui.search.val('map:');
    _t.vw.search.__ui.search.trigger('keyup');

    // Input should be bold.
    expect(_t.vw.search.__ui.search).toHaveClass('bold');

  });


  it('should unbold the input for regular keyword query', function() {

    // --------------------------------------------------------------------
    // When the input has been bolded in response to a structured query
    // (tags or map mirroring) and then the value is changed to a regular
    // keyword, the input should be un-bolded.
    // --------------------------------------------------------------------

    // Exiting tags query.
    _t.vw.search.__ui.search.val('tags:');
    _t.vw.search.__ui.search.trigger('keyup');
    _t.vw.search.__ui.search.val('tags');
    _t.vw.search.__ui.search.trigger('keyup');

    // Input should not be bold.
    expect(_t.vw.search.__ui.search).not.toHaveClass('bold');

    // Exiting map mirroring.
    _t.vw.search.__ui.search.val('map:');
    _t.vw.search.__ui.search.trigger('keyup');
    _t.vw.search.__ui.search.val('map');
    _t.vw.search.__ui.search.trigger('keyup');

    // Input should not be bold.
    expect(_t.vw.search.__ui.search).not.toHaveClass('bold');

  });


  it('should execute keyword search on keyup', function() {

    // --------------------------------------------------------------------
    // When a character is typed in the search box and the query value is
    // a regular keyword query, a GET request should be generated and the
    // record list should updated with the results.
    // --------------------------------------------------------------------

    // Keyup with 'keyword' in the box.
    _t.vw.search.__ui.search.val('word1 word2');
    _t.vw.search.__ui.search.trigger('keyup');

    // Should produce GET request to /records.
    _t.assertLastRequestRoute(__exhibit.api.records);
    _t.assertLastRequestMethod('GET');

    // `query`=word, default `limit` and `offset`.
    _t.assertLastRequestHasGetParameter('query', 'word1+word2');
    _t.assertLastRequestHasGetParameter('limit', __editor.perPage);
    _t.assertLastRequestHasGetParameter('offset', '0');

    // Inject a new records collection.
    _t.respondLast200(_t.json.records.p6);
    var firstRecord = _t.getRecordRows()[1];

    // Record list should be updated.
    expect($(firstRecord).find('.title').text()).toEqual('Record0');

  });


  it('should execute tags search on keyup', function() {

    // --------------------------------------------------------------------
    // When a character is typed in the search box and the query value is
    // a tag string, a GET request should be generated and the record list
    // should updated with the results.
    // --------------------------------------------------------------------

    // Keyup with tag string in the box.
    _t.vw.search.__ui.search.val('tags: tag1, tag2');
    _t.vw.search.__ui.search.trigger('keyup');

    // Should produce GET request to /records.
    _t.assertLastRequestRoute(__exhibit.api.records);
    _t.assertLastRequestMethod('GET');

    // `tags[]`=tag1, `tags[]`=tag2.
    var request = _t.getLastRequest();
    expect(request.url).toContain($.param({tags: ['tag1', 'tag2']}));

    // Default `limit` and `offset`.
    _t.assertLastRequestHasGetParameter('limit', __editor.perPage);
    _t.assertLastRequestHasGetParameter('offset', '0');

    // Inject a new records collection.
    _t.respondLast200(_t.json.records.p6);
    var firstRecord = _t.getRecordRows()[1];

    // Record list should be updated.
    expect($(firstRecord).find('.title').text()).toEqual('Record0');

  });


  it('should update the route on keystroke', function() {

    // --------------------------------------------------------------------
    // When characters are typed in the search box, the route should be
    // updated in real-time to match the current query value.
    // --------------------------------------------------------------------

    // Keyup with one word.
    _t.vw.search.__ui.search.val('word1');
    _t.vw.search.__ui.search.trigger('keyup');

    // Route should be updated.
    expect(Backbone.history.fragment).toEqual(
      'records/search/query=word1');

    // Keyup with multiple words.
    _t.vw.search.__ui.search.val('word1 word2 word3');
    _t.vw.search.__ui.search.trigger('keyup');

    // Route should be updated.
    expect(Backbone.history.fragment).toEqual(
      'records/search/query=word1+word2+word3');

    // Keyup with empty query.
    _t.vw.search.__ui.search.val('');
    _t.vw.search.__ui.search.trigger('keyup');

    // Route should be updated.
    expect(Backbone.history.fragment).toEqual(
      'records');

  });


});
