
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Tests for form data population and publication.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Form Data I/O', function() {

  var server, records, models;
  var json = readFixtures('records.json');

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

    // Get models record listings.
    records = _t.records.$el.find('.record-row');
    models = Editor.Modules.Records.collection.models;

    // Open form.
    $(records[0]).trigger('click');

  });

  it('should populate form values', function() {

    // Check for form and values.
    expect(_t.form.head.text()).toEqual('Record 1');
    expect(_t.form.title.val()).toEqual('Record 1');
    expect(_t.form.body.val()).toEqual('Record 1 desc.');
    expect(_t.form.vectorColor.val()).toEqual('#111111');
    expect(_t.form.strokeColor.val()).toEqual('#444444');
    expect(_t.form.selectColor.val()).toEqual('#777777');
    expect(_t.form.vectorOpacity.val()).toEqual('1');
    expect(_t.form.selectOpacity.val()).toEqual('4');
    expect(_t.form.strokeOpacity.val()).toEqual('7');
    expect(_t.form.graphicOpacity.val()).toEqual('10');
    expect(_t.form.strokeWidth.val()).toEqual('13');
    expect(_t.form.pointRadius.val()).toEqual('16');
    expect(_t.form.coverage.val()).toEqual('POINT(1 1)');
    expect(_t.form.pointGraphic.val()).toEqual(
      'https://www.google.com/favicon.ico');

  });

  it('should PUT well-formed data on save', function() {

    // Enter new data.
    _t.form.title.val('Record 2');
    _t.form.body.val('Record 2 desc.');
    _t.form.vectorColor.val('#222222');
    _t.form.strokeColor.val('#555555');
    _t.form.selectColor.val('#888888');
    _t.form.vectorOpacity.val('2');
    _t.form.selectOpacity.val('5');
    _t.form.strokeOpacity.val('8');
    _t.form.graphicOpacity.val('11');
    _t.form.strokeWidth.val('14');
    _t.form.pointRadius.val('17');
    _t.form.coverage.val(models[1].get('coverage'));
    _t.form.pointGraphic.val('file2.png');

    // Click save, capture request.
    _t.form.saveButton.trigger('click');
    var request = _.last(server.requests);
    var params = $.parseJSON(request.requestBody);

    // Check route.
    expect(request.url).toEqual('/neatline/records/'+
      models[0].get('id'));

    // Check query string.
    expect(params.title).toEqual('Record 2');
    expect(params.description).toEqual('Record 2 desc.');
    expect(params.vector_color).toEqual('#222222');
    expect(params.stroke_color).toEqual('#555555');
    expect(params.select_color).toEqual('#888888');
    expect(params.vector_opacity).toEqual('2');
    expect(params.select_opacity).toEqual('5');
    expect(params.stroke_opacity).toEqual('8');
    expect(params.graphic_opacity).toEqual('11');
    expect(params.stroke_width).toEqual('14');
    expect(params.point_radius).toEqual('17');
    expect(params.point_image).toEqual('file2.png');
    expect(params.coverage).toEqual('POINT(2 2)');

  });

});
