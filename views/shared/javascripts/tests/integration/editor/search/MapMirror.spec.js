
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
    __editor.perPage = 1;
  });


  it('should not issue GET request when `map:` is entered', function() {

    // --------------------------------------------------------------------
    // A regular search GET request should not be issued in response to a
    // keystroke if the input value starts with `map:`.
    // --------------------------------------------------------------------

    // Keyup with `map:`.
    var c1 = _t.server.requests.length;
    _t.vw.search.__ui.search.val('map:');
    _t.vw.search.__ui.search.trigger('keyup');
    var c2 = _t.server.requests.length;
    expect(c2).toEqual(c1);

    // Keyup with `map:other`.
    var c1 = _t.server.requests.length;
    _t.vw.search.__ui.search.val('map:other');
    _t.vw.search.__ui.search.trigger('keyup');
    var c2 = _t.server.requests.length;
    expect(c2).toEqual(c1);

  });


  it('should start syncing with map when activated', function() {

    // Load 1 record on map.
    _t.refreshMap(_t.json.records.p6);

    // Keyup with `map:` in the box.
    _t.vw.search.__ui.search.val('map:');
    _t.vw.search.__ui.search.trigger('keyup');

    // Record list should synchronize with map.
    var recordRows = _t.getRecordRows();
    expect($(recordRows[1]).find('.title')).toHaveText('_Record0');
    expect(recordRows.length).toEqual(2);

    // No pagination.
    _t.assertPaginationEmpty();

  });


  it('should start syncing with map on route request', function() {

    // Manually set the `records` reference on the map view to null to
    // emulate the state of the view when the application starts before
    // the first collection is ingested.
    _t.vw.map.records = null;

    // Load route with `map:` as query.
    _t.navigate('records/search/query=map:');

    // Load 1 record on map.
    _t.refreshMap(_t.json.records.p6);

    // Record list should synchronize with map.
    var recordRows = _t.getRecordRows();
    expect($(recordRows[1]).find('.title')).toHaveText('_Record0');
    expect(recordRows.length).toEqual(2);

    // No pagination.
    _t.assertPaginationEmpty();

  });


  it('should synchronize when map is updated', function() {

    // Keyup with `map:` in the box.
    _t.vw.search.__ui.search.val('map:');
    _t.vw.search.__ui.search.trigger('keyup');

    // Load 2 records on map.
    _t.refreshMap(_t.json.records.p56);

    // Record list should synchronize with map.
    var recordRows = _t.getRecordRows();
    expect($(recordRows[1]).find('.title')).toHaveText('_Record1');
    expect($(recordRows[2]).find('.title')).toHaveText('_Record0');
    expect(recordRows.length).toEqual(3);

    // No pagination.
    _t.assertPaginationEmpty();

  });


  it('should stop syncing when deactivated via backspace', function() {

    // Keyup with `map:` in the box.
    _t.vw.search.__ui.search.val('map:');
    _t.vw.search.__ui.search.trigger('keyup');

    // Backspace once.
    _t.vw.search.__ui.search.val('map');
    _t.vw.search.__ui.search.trigger('keyup');
    _t.respondRecords();

    // Update map records.
    _t.refreshMap(_t.json.records.p56);

    // Record list should not synchronize with the map.
    var recordRows = _t.getRecordRows();
    expect($(recordRows[1]).find('.title')).toHaveText('_title1');
    expect($(recordRows[2]).find('.title')).toHaveText('_title2');
    expect($(recordRows[3]).find('.title')).toHaveText('_title3');
    expect(recordRows.length).toEqual(4);

    // Pagination visible.
    _t.assertPaginationNotEmpty();

  });


  it('should stop syncing when deactivated via clear', function() {

    // Keyup with `map:` in the box.
    _t.vw.search.__ui.search.val('map:');
    _t.vw.search.__ui.search.trigger('keyup');

    // Clear the search box, load default records.
    _t.vw.search.__ui.search.val('');
    _t.vw.search.__ui.search.trigger('keyup');
    _t.respondRecords();

    // Update map records.
    _t.refreshMap(_t.json.records.p56);

    // Record list should not synchronize with the map.
    var recordRows = _t.getRecordRows();
    expect($(recordRows[1]).find('.title')).toHaveText('_title1');
    expect($(recordRows[2]).find('.title')).toHaveText('_title2');
    expect($(recordRows[3]).find('.title')).toHaveText('_title3');
    expect(recordRows.length).toEqual(4);

    // Pagination visible.
    _t.assertPaginationNotEmpty();

  });


});
