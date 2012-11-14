
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Unit tests for editor records list.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records', function() {

  var editor, records;

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

    // Get records and editor.
    records = _t.records.$el.find('.record-row');
    editor = $('#editor');

  });

  it('should list records', function() {

    // 2 records in browser pane.
    expect(records.length).toEqual(2);
    expect($(records[0]).text()).toEqual('Record 1');
    expect($(records[1]).text()).toEqual('Record 2');

  });

  it('should open form when a record row is clicked', function() {

    // Click on Record1.
    $(records[0]).trigger('click');

    // Check for no records.
    expect(editor).not.toContain('ul.records');
    expect(editor).not.toContain('li.record-row');

    // Check for form and values.
    expect(editor).toContain(_t.form.form);
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

    // Close Record 1, open Record 2.
    _t.form.closeButton.trigger('click');
    records = _t.records.$el.find('.record-row');
    $(records[1]).trigger('click');

    // Check for form and values.
    expect(editor).toContain(_t.form.form);
    expect(_t.form.head.text()).toEqual('Record 2');
    expect(_t.form.title.val()).toEqual('Record 2');
    expect(_t.form.body.val()).toEqual('Record 2 desc.');
    expect(_t.form.vectorColor.val()).toEqual('#222222');
    expect(_t.form.strokeColor.val()).toEqual('#444444');
    expect(_t.form.selectColor.val()).toEqual('#666666');
    expect(_t.form.vectorOpacity.val()).toEqual('2');
    expect(_t.form.selectOpacity.val()).toEqual('4');
    expect(_t.form.strokeOpacity.val()).toEqual('6');
    expect(_t.form.graphicOpacity.val()).toEqual('8');
    expect(_t.form.strokeWidth.val()).toEqual('10');
    expect(_t.form.pointRadius.val()).toEqual('12');
    expect(_t.form.pointGraphic.val()).toEqual('file2.png');
    expect(_t.form.coverage.val()).toEqual('kml2');

  });

});
