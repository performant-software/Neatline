
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search map mirroring tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Search Map Mirroring', function() {


  beforeEach(function() {
    _t.loadEditor();
    _t.respondRecordList200(_t.json.SearchMapMirror.records.list);
  });


  it('should not load records when `map:` is entered', function() {

    // --------------------------------------------------------------------
    // When `map:` is typed into the search box, the regular GET request
    // for records should not be issued.
    // --------------------------------------------------------------------

    // Keyup with `map:`.
    var c1 = _t.server.requests.length;
    _t.vw.SEARCH.__ui.search.val('map:');
    _t.vw.SEARCH.__ui.search.trigger('keyup');
    var c2 = _t.server.requests.length;
    expect(c2).toEqual(c1);

    // Keyup with `map:other`.
    var c1 = _t.server.requests.length;
    _t.vw.SEARCH.__ui.search.val('map:other');
    _t.vw.SEARCH.__ui.search.trigger('keyup');
    var c2 = _t.server.requests.length;
    expect(c2).toEqual(c1);

  });


  it('should start syncing with map when activated', function() {

    // --------------------------------------------------------------------
    // When `map:` is typed into the search box, the record list should
    // immediately synchronize with the collection on the map.
    // --------------------------------------------------------------------

    _t.respondMap200(_t.json.SearchMapMirror.records.map);

    // Keyup with `map:` in the box.
    _t.vw.SEARCH.__ui.search.val('map:').trigger('keyup');

    // List should synchronize with map.
    var recordRows = _t.getRecordListRows();
    expect($(recordRows[1]).find('.title')).toHaveText('map1');
    expect($(recordRows[2]).find('.title')).toHaveText('map2');
    expect($(recordRows[3]).find('.title')).toHaveText('map3');
    expect(recordRows.length).toEqual(4);

  });


  it('should start syncing with map on route request', function() {

    // --------------------------------------------------------------------
    // When a route is requested with `map:` as the search query, the
    // record list shold synchronize with the collection on the map.
    // --------------------------------------------------------------------

    _t.respondMap200(_t.json.SearchMapMirror.records.map);

    // Request route with `map:` as query.
    _t.navigate('records/search/query=map:');

    // List should synchronize with map.
    var recordRows = _t.getRecordListRows();
    expect($(recordRows[1]).find('.title')).toHaveText('map1');
    expect($(recordRows[2]).find('.title')).toHaveText('map2');
    expect($(recordRows[3]).find('.title')).toHaveText('map3');
    expect(recordRows.length).toEqual(4);

  });


  it('should synchronize when map is updated', function() {

    // --------------------------------------------------------------------
    // When map mirroring is active, the record list should display the
    // same set of records that is currently visible on the map.
    // --------------------------------------------------------------------

    // Keyup with `map:` in the box.
    _t.vw.SEARCH.__ui.search.val('map:').trigger('keyup');

    // Ingest new records on the map.
    _t.refreshMap(_t.json.SearchMapMirror.records.map);

    // List should synchronize with map.
    var recordRows = _t.getRecordListRows();
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
    Neatline.global.page_length = 1;

    // Load 3 records on the map.
    _t.respondMap200(_t.json.SearchMapMirror.records.map);

    // Activate mirroring.
    _t.vw.SEARCH.__ui.search.val('map:').trigger('keyup');

    // Pagination should not be visible.
    expect(_t.vw.RECORDS.$el).not.toContain('.pagination');

  });


  it('should stop syncing when deactivated via backspace', function() {

    // --------------------------------------------------------------------
    // When the `map:` query pattern is broken by a single keystroke (eg,
    // when `map:` is changed to just `map`), the record list should stop
    // mirroring the map.
    // --------------------------------------------------------------------

    // Keyup with `map:` in the box.
    _t.vw.SEARCH.__ui.search.val('map:').trigger('keyup');

    // Backspace once.
    _t.vw.SEARCH.__ui.search.val('map').trigger('keyup');

    // Respond with default record collection.
    _t.respondLast200(_t.json.SearchMapMirror.records.list);

    // Update map records.
    _t.refreshMap(_t.json.SearchMapMirror.records.map);

    // List should not synchronize with map.
    var recordRows = _t.getRecordListRows();
    expect($(recordRows[1]).find('.title')).toHaveText('list1');
    expect($(recordRows[2]).find('.title')).toHaveText('list2');
    expect($(recordRows[3]).find('.title')).toHaveText('list3');
    expect(recordRows.length).toEqual(4);

  });


  it('should stop syncing when deactivated via clear', function() {

    // --------------------------------------------------------------------
    // When map mirroring is enabled and the search box is completely
    // cleared, the record list should stop mirroring the map.
    // --------------------------------------------------------------------

    // Keyup with `map:` in the box.
    _t.vw.SEARCH.__ui.search.val('map:').trigger('keyup');

    // Clear the search box.
    _t.vw.SEARCH.__ui.search.val('').trigger('keyup');

    // Respond with default record collection.
    _t.respondLast200(_t.json.SearchMapMirror.records.list);

    // Update map records.
    _t.refreshMap(_t.json.SearchMapMirror.records.map);

    // List should not synchronize with map.
    var recordRows = _t.getRecordListRows();
    expect($(recordRows[1]).find('.title')).toHaveText('list1');
    expect($(recordRows[2]).find('.title')).toHaveText('list2');
    expect($(recordRows[3]).find('.title')).toHaveText('list3');
    expect(recordRows.length).toEqual(4);

  });


});
