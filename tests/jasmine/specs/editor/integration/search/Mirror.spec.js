
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Search Map Mirroring', function() {


  var fx = {
    list: read('EditorSearchMirror.list.json'),
    map:  read('EditorSearchMirror.map.json')
  };


  beforeEach(function() {
    NL.loadEditor();
    NL.respondRecordList200(fx.list);
  });


  it('should not load records when `map:` is entered', function() {

    // --------------------------------------------------------------------
    // When `map:` is typed into the search box, the regular GET request
    // for records should not be issued.
    // --------------------------------------------------------------------

    // Keyup with `map:`.
    var c1 = NL.server.requests.length;
    NL.vw.SEARCH.__ui.search.val('map:');
    NL.vw.SEARCH.__ui.search.trigger('keyup');
    var c2 = NL.server.requests.length;
    expect(c2).toEqual(c1);

    // Keyup with `map:other`.
    var c1 = NL.server.requests.length;
    NL.vw.SEARCH.__ui.search.val('map:other');
    NL.vw.SEARCH.__ui.search.trigger('keyup');
    var c2 = NL.server.requests.length;
    expect(c2).toEqual(c1);

  });


  it('should start mirroring when query pattern entered', function() {

    // --------------------------------------------------------------------
    // When `map:` is typed into the search box, the record list should
    // immediately synchronize with the collection on the map.
    // --------------------------------------------------------------------

    NL.respondMap200(fx.map);

    // Keyup with `map:` in the box.
    NL.vw.SEARCH.__ui.search.val('map:').trigger('keyup');

    // List should synchronize with map.
    var recordRows = NL.getRecordListRows();
    expect($(recordRows[1]).find('.title')).toHaveText('map1');
    expect($(recordRows[2]).find('.title')).toHaveText('map2');
    expect($(recordRows[3]).find('.title')).toHaveText('map3');
    expect(recordRows.length).toEqual(4);

  });


  it('should start mirroring on route request', function() {

    // --------------------------------------------------------------------
    // When a route is requested with `map:` as the search query, the
    // record list shold synchronize with the collection on the map.
    // --------------------------------------------------------------------

    NL.respondMap200(fx.map);

    // Request route with `map:` as query.
    NL.navigate('records/search/query=map:');

    // List should synchronize with map.
    var recordRows = NL.getRecordListRows();
    expect($(recordRows[1]).find('.title')).toHaveText('map1');
    expect($(recordRows[2]).find('.title')).toHaveText('map2');
    expect($(recordRows[3]).find('.title')).toHaveText('map3');
    expect(recordRows.length).toEqual(4);

  });


  it('should mirror when map is updated', function() {

    // --------------------------------------------------------------------
    // When map mirroring is active, the record list should display the
    // same set of records that is currently visible on the map.
    // --------------------------------------------------------------------

    // Keyup with `map:` in the box.
    NL.vw.SEARCH.__ui.search.val('map:').trigger('keyup');

    // Ingest new records on the map.
    NL.refreshMap(fx.map);

    // List should synchronize with map.
    var recordRows = NL.getRecordListRows();
    expect($(recordRows[1]).find('.title')).toHaveText('map1');
    expect($(recordRows[2]).find('.title')).toHaveText('map2');
    expect($(recordRows[3]).find('.title')).toHaveText('map3');
    expect(recordRows.length).toEqual(4);

  });


  it('should not show pagination when mirroring', function() {

    // --------------------------------------------------------------------
    // When map mirroring is active, the record pagination should not be
    // displayed, even when the number of records exceeds the page limit.
    // --------------------------------------------------------------------

    // Set page length to 1.
    Neatline.global.per_page = 1;

    // Load 3 records on the map.
    NL.respondMap200(fx.map);

    // Activate mirroring.
    NL.vw.SEARCH.__ui.search.val('map:').trigger('keyup');

    // Pagination should not be visible.
    expect(NL.vw.RECORDS.$el).not.toContain('.pagination');

  });


  it('should stop mirroring when query pattern broken', function() {

    // --------------------------------------------------------------------
    // When the `map:` query pattern is broken, the record list should
    // stop mirroring the map and start loading regular search results.
    // --------------------------------------------------------------------

    // Keyup with `map:` in the box.
    NL.vw.SEARCH.__ui.search.val('map:').trigger('keyup');

    // Backspace once.
    NL.vw.SEARCH.__ui.search.val('map').trigger('keyup');

    // Respond with default record collection.
    NL.respondLast200(fx.list);

    // Update map records.
    NL.refreshMap(fx.map);

    // List should not synchronize with map.
    var recordRows = NL.getRecordListRows();
    expect($(recordRows[1]).find('.title')).toHaveText('list1');
    expect($(recordRows[2]).find('.title')).toHaveText('list2');
    expect($(recordRows[3]).find('.title')).toHaveText('list3');
    expect(recordRows.length).toEqual(4);

  });


});
