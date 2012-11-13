/**
 * Unit tests for editor records list.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records', function() {

  var json = {
    status: 200, responseText: readFixtures('editor-records.json')
  };

  // Get fixtures.
  beforeEach(function() {

    // Load partial.
    loadFixtures('editor-partial.html');
    jasmine.Ajax.useMock();

    // Run Editor.
    _t.loadEditor();
    var request = mostRecentAjaxRequest();
    request.response(json);

  });

  it('should list records', function() {
    var records = _t.records.$el.find('.record-row');
    expect(records.length).toEqual(2);
    expect($(records[0]).text()).toEqual('Record 1');
    expect($(records[1]).text()).toEqual('Record 2');
  });

});
