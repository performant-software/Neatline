
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

  it('should PUT well-formed data on save', function() {

    // Enter new data.
    _t.form.title.val('Record 2');
    _t.form.body.val('Record 2 desc.');
    _t.form.vectorColor.val('#222222');
    _t.form.strokeColor.val('#444444');
    _t.form.selectColor.val('#666666');
    _t.form.vectorOpacity.val('2');
    _t.form.selectOpacity.val('4');
    _t.form.strokeOpacity.val('6');
    _t.form.graphicOpacity.val('8');
    _t.form.strokeWidth.val('10');
    _t.form.pointRadius.val('12');
    _t.form.pointGraphic.val('file2.png');
    _t.form.coverage.val('kml2');

    // Click save, capture request.
    _t.form.saveButton.trigger('click');
    var request = mostRecentAjaxRequest();
    var params = $.parseJSON(request.params);

    // Check query string.
    expect(request.url).toEqual('/neatline/record/');
    expect(params.title).toEqual('Record 2');
    expect(params.description).toEqual('Record 2 desc.');
    expect(params.vector_color).toEqual('#222222');
    expect(params.stroke_color).toEqual('#444444');
    expect(params.select_color).toEqual('#666666');
    expect(params.vector_opacity).toEqual('2');
    expect(params.select_opacity).toEqual('4');
    expect(params.stroke_opacity).toEqual('6');
    expect(params.graphic_opacity).toEqual('8');
    expect(params.stroke_width).toEqual('10');
    expect(params.point_radius).toEqual('12');
    expect(params.point_image).toEqual('file2.png');
    expect(params.coverage).toEqual('kml2');

  });

});
