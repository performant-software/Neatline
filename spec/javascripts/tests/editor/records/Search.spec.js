
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Record search tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records Search', function() {

  var editor, records, server;

  // Load AJAX fixtures.
  var json = readFixtures('records.json');
  var jsonRemovedData = readFixtures('records-removed-record.json');

  // Get fixtures.
  beforeEach(function() {

    // Load partial, mock server.
    loadFixtures('editor-partial.html');
    server = sinon.fakeServer.create();

    // Run Editor.
    _t.loadEditor();

    // Intercept requests.
    _.each(server.requests, function(r) {
      _t.respond200(r, json);
    });

  });

  it('should execute a keyword query on `Enter`', function() {

    // 3 records at start.
    var records = _t.records.$el.find('.record-row');
    expect(records.length).toEqual(3);
    expect($(records[0]).text()).toEqual('Record 1');
    expect($(records[1]).text()).toEqual('Record 2');
    expect($(records[2]).text()).toEqual('Record 3');

    // Spy on the event aggregator.
    var spy = spyOn(Editor.vent, 'trigger').andCallThrough();

    // Set input value.
    _t.search.input.val('query');

    // Simulate `Enter`.
    var e = $.Event('keyup', { keyCode: 13 });
    _t.search.input.trigger(e);

    // Inject changed records fixture.
    var request = _.last(server.requests);
    _t.respond200(request, jsonRemovedData);

    // Check publication.
    expect(spy.argsForCall[0][0]).toEqual('search:query');
    expect(spy.argsForCall[0][1].keywords).toEqual('query');
    expect(spy.argsForCall[0][1].tags).toBeNull();

    // Check for modified record list.
    records = _t.records.$el.find('.record-row');
    expect(records.length).toEqual(2);
    expect($(records[0]).text()).toEqual('Record 1');
    expect($(records[1]).text()).toEqual('Record 3');

  });

  it('should execute a keyword query on search button click');

  it('should execute a tags query on `Enter`');

  it('should execute a tags query on search button click');

  it('should enable map mirroring on button click');

  it('should disable text search when mirroring is enabled');

  it('should disable text search on cancel button click');

  it('should disable mirroring on cancel button click');

});
