
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

  var records, models;

  // Get fixtures.
  beforeEach(function() {

    _t.loadEditor();

    // Get models record listings.
    records = _t.records.$el.find('.record-row');
    models = Editor.Modules.Records.collection.models;

    // Open form.
    $(records[0]).trigger('click');

  });

  it('should populate form values', function() {

    // --------------------------------------------------------------------
    // When the edit form for a record is opened in the editor, the form
    // should render data from the record's model into the form fields.
    // --------------------------------------------------------------------

    var favicon = 'https://www.google.com/favicon.ico';

    // Check for form and values.
    expect(_t.form.head.text()).          toEqual('Record 1');
    expect(_t.form.title.val()).          toEqual('Record 1');
    expect(_t.form.body.val()).           toEqual('Record 1 desc.');
    expect(_t.form.vectorColor.val()).    toEqual('#111111');
    expect(_t.form.strokeColor.val()).    toEqual('#444444');
    expect(_t.form.selectColor.val()).    toEqual('#777777');
    expect(_t.form.vectorOpacity.val()).  toEqual('1');
    expect(_t.form.selectOpacity.val()).  toEqual('4');
    expect(_t.form.strokeOpacity.val()).  toEqual('7');
    expect(_t.form.graphicOpacity.val()). toEqual('10');
    expect(_t.form.strokeWidth.val()).    toEqual('13');
    expect(_t.form.pointRadius.val()).    toEqual('16');
    expect(_t.form.minZoom.val()).        toEqual('19');
    expect(_t.form.maxZoom.val()).        toEqual('22');
    expect(_t.form.coverage.val()).       toEqual('POINT(1 2)');
    expect(_t.form.pointGraphic.val()).   toEqual(favicon);

  });

  it('should PUT well-formed data on save', function() {

    // --------------------------------------------------------------------
    // When the user clicks the "Save" button at the bottom of the edit
    // form for a record, the form should gather the updated values from
    // the input fields and issue a PUT request to the records API with
    // the new data.
    // --------------------------------------------------------------------

    // Enter new values into the inputs.
    _t.form.title.          val('Record 2');
    _t.form.body.           val('Record 2 desc.');
    _t.form.vectorColor.    val('#222222');
    _t.form.strokeColor.    val('#555555');
    _t.form.selectColor.    val('#888888');
    _t.form.vectorOpacity.  val('2');
    _t.form.selectOpacity.  val('5');
    _t.form.strokeOpacity.  val('8');
    _t.form.graphicOpacity. val('11');
    _t.form.strokeWidth.    val('14');
    _t.form.pointRadius.    val('17');
    _t.form.minZoom.        val('20');
    _t.form.maxZoom.        val('23');
    _t.form.coverage.       val('POINT(3 4)');
    _t.form.pointGraphic.   val('file2.png');

    // Click save, capture request.
    _t.form.saveButton.trigger('click');
    var request = _.last(_t.server.requests);
    var params = $.parseJSON(request.requestBody);

    // Check route.
    expect(request.url).toEqual(
      '/neatline/records/'+models[0].get('id')
    );

    // Check the query string for updated values.
    expect(params.title).           toEqual('Record 2');
    expect(params.description).     toEqual('Record 2 desc.');
    expect(params.vector_color).    toEqual('#222222');
    expect(params.stroke_color).    toEqual('#555555');
    expect(params.select_color).    toEqual('#888888');
    expect(params.vector_opacity).  toEqual('2');
    expect(params.select_opacity).  toEqual('5');
    expect(params.stroke_opacity).  toEqual('8');
    expect(params.graphic_opacity). toEqual('11');
    expect(params.stroke_width).    toEqual('14');
    expect(params.point_radius).    toEqual('17');
    expect(params.min_zoom).        toEqual('20');
    expect(params.max_zoom).        toEqual('23');
    expect(params.coverage).        toEqual('POINT(3 4)');
    expect(params.point_image).     toEqual('file2.png');

  });

});
