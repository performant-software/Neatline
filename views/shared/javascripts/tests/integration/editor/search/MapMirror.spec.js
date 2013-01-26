
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


  it('should synchronize with map when activated', function() {

    // Load 1 record on map.
    _t.refreshMap(_t.json.records.p6);

    // Keyup with `map:` in the box.
    _t.vw.search.__ui.search.val('map:');
    _t.vw.search.__ui.search.trigger('keyup');
    var recordRows = _t.getRecordRows();

    // Record list should synchronize with map.
    expect($(recordRows[1]).find('.title').text()).toEqual('Record5');
    expect(recordRows.length).toEqual(2);

  });


  it('should synchronize with map on route request', function() {

    // Load route with `map:` as query.
    _t.navigate('records/search/query=map:');

    // Load 1 record on map.
    _t.refreshMap(_t.json.records.p6);
    var recordRows = _t.getRecordRows();

    // Record list should synchronize with map.
    expect($(recordRows[1]).find('.title').text()).toEqual('Record5');
    expect(recordRows.length).toEqual(2);

  });


  it('should synchronize when map is updated', function() {

    // Keyup with `map:` in the box.
    _t.vw.search.__ui.search.val('map:');
    _t.vw.search.__ui.search.trigger('keyup');

    // Load 2 records on map.
    _t.refreshMap(_t.json.records.p56);

    // Record list should synchronize with map.
    expect($(recordRows[1]).find('.title').text()).toEqual('Record4');
    expect($(recordRows[2]).find('.title').text()).toEqual('Record5');
    expect(recordRows.length).toEqual(3);

  });


  it('should stop synchronizing when deactivated', function() {

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
    expect($(recordRows[1]).find('.title').text()).toEqual('title1');
    expect($(recordRows[2]).find('.title').text()).toEqual('title2');
    expect($(recordRows[3]).find('.title').text()).toEqual('title3');
    expect($(recordRows[4]).find('.title').text()).toEqual('title4');
    expect(recordRows.length).toEqual(5);

  });


});
