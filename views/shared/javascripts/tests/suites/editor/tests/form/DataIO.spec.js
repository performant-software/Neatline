
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for form data population and publication.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Form Data I/O', function() {

  // Start editor.
  beforeEach(function() {

    _t.loadEditor();

    // Open form.
    var recordRows = _t.getRecordRows();
    $(recordRows[0]).trigger('click');

  });

  it('should populate form values', function() {

    // --------------------------------------------------------------------
    // When the edit form for a record is opened in the editor, the form
    // should render data from the record's model into the form fields.
    // --------------------------------------------------------------------

    var favicon = 'https://www.google.com/favicon.ico';

    // Check for form and values.
    expect(_t.formView.els.head.text()).          toEqual('Title 1');
    expect(_t.formView.els.title.val()).          toEqual('Title 1');
    expect(_t.formView.els.body.val()).           toEqual('Body 1.');
    expect(_t.formView.els.vectorColor.val()).    toEqual('#111111');
    expect(_t.formView.els.strokeColor.val()).    toEqual('#444444');
    expect(_t.formView.els.selectColor.val()).    toEqual('#777777');
    expect(_t.formView.els.vectorOpacity.val()).  toEqual('1');
    expect(_t.formView.els.selectOpacity.val()).  toEqual('4');
    expect(_t.formView.els.strokeOpacity.val()).  toEqual('7');
    expect(_t.formView.els.imageOpacity.val()).   toEqual('10');
    expect(_t.formView.els.strokeWidth.val()).    toEqual('13');
    expect(_t.formView.els.pointRadius.val()).    toEqual('16');
    expect(_t.formView.els.minZoom.val()).        toEqual('19');
    expect(_t.formView.els.maxZoom.val()).        toEqual('22');
    expect(_t.formView.els.coverage.val()).       toEqual('POINT(1 2)');
    expect(_t.formView.els.pointGraphic.val()).   toEqual(favicon);

  });

  it('should PUT well-formed data on save', function() {

    // --------------------------------------------------------------------
    // When the user clicks the "Save" button at the bottom of the edit
    // form for a record, the form should gather the updated values from
    // the input fields and issue a PUT request to the records API with
    // the new data.
    // --------------------------------------------------------------------

    // Get the id of the current form model.
    var id = _.first(_t.recordsColl.models).get('id');

    // Enter new values into the inputs.
    _t.formView.els.title.          val('Title 2');
    _t.formView.els.body.           val('Body 2.');
    _t.formView.els.vectorColor.    val('#222222');
    _t.formView.els.strokeColor.    val('#555555');
    _t.formView.els.selectColor.    val('#888888');
    _t.formView.els.vectorOpacity.  val('2');
    _t.formView.els.selectOpacity.  val('5');
    _t.formView.els.strokeOpacity.  val('8');
    _t.formView.els.imageOpacity.   val('11');
    _t.formView.els.strokeWidth.    val('14');
    _t.formView.els.pointRadius.    val('17');
    _t.formView.els.minZoom.        val('20');
    _t.formView.els.maxZoom.        val('23');
    _t.formView.els.coverage.       val('POINT(3 4)');
    _t.formView.els.pointGraphic.   val('file2.png');

    // Click "Save" button.
    _t.formView.els.saveButton.trigger('click');

    // Capture outoing PUT request.
    var request = _t.getLastRequest();
    var params = $.parseJSON(request.requestBody);

    // Check method and route.
    expect(request.method).toEqual('PUT');
    expect(request.url).toEqual('/neatline/records/'+id);

    // Check the query string for updated values.
    expect(params.title).           toEqual('Title 2');
    expect(params.description).     toEqual('Body 2.');
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
