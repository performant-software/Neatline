
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Edit form tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Form', function() {

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

    // Open record form.
    var records = _t.records.$el.find('.record-row');
    $(records[0]).trigger('click');

  });

  it('should populate form values', function() {

    // Check for form and values.
    expect(_t.records.$el).toContain(_t.form.form);
    expect(_t.form.head.text()).toEqual('Record 1');
    expect(_t.form.title.val()).toEqual('Record 1');
    expect(_t.form.body.val()).toEqual('Record 1 desc.');
    expect(_t.form.vectorColor.val()).toEqual('#111111');
    expect(_t.form.strokeColor.val()).toEqual('#333333');
    expect(_t.form.selectColor.val()).toEqual('#555555');
    expect(_t.form.vectorOpacity.val()).toEqual('1');
    expect(_t.form.selectOpacity.val()).toEqual('3');
    expect(_t.form.strokeOpacity.val()).toEqual('5');
    expect(_t.form.graphicOpacity.val()).toEqual('7');
    expect(_t.form.strokeWidth.val()).toEqual('9');
    expect(_t.form.pointRadius.val()).toEqual('11');
    expect(_t.form.pointGraphic.val()).toEqual('file1.png');
    expect(_t.form.coverage.val()).toEqual('kml1');

  });

});
