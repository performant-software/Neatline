
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for form delete.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Form Save', function() {

  var els;

  beforeEach(function() {

    _t.loadEditor();
    _t.openRecordForm();

    els = {
      save: _t.vw.record.$('a[name="save"]'),
    };

  });

  it('should generate a well-formed PUT request', function() {

    // --------------------------------------------------------------------
    // When the user clicks the "Save" button at the bottom of the edit
    // form for a record, the form should gather the updated values from
    // the input fields and issue a PUT request to the records API with
    // the new data.
    // --------------------------------------------------------------------

    // Get the model id and form elements.
    var id = _t.vw.record.model.get('id');
    var inputs = _t.getRecordFormElements();

    inputs.title.          val('title2').      trigger('change');
    inputs.body.           val('body2').       trigger('change');
    inputs.coverage.       val('POINT(3 4)').  trigger('change');
    inputs.vectorColor.    val('#222222').     trigger('change');
    inputs.strokeColor.    val('#555555').     trigger('change');
    inputs.selectColor.    val('#888888').     trigger('change');
    inputs.vectorOpacity.  val('2').           trigger('change');
    inputs.selectOpacity.  val('5').           trigger('change');
    inputs.strokeOpacity.  val('8').           trigger('change');
    inputs.imageOpacity.   val('11').          trigger('change');
    inputs.strokeWidth.    val('14').          trigger('change');
    inputs.pointRadius.    val('17').          trigger('change');
    inputs.pointImage.     val('file2.png').   trigger('change');
    inputs.minZoom.        val('20').          trigger('change');
    inputs.maxZoom.        val('23').          trigger('change');
    inputs.mapFocus.       val('200,300').     trigger('change');
    inputs.mapZoom.        val('24').          trigger('change');

    // Click "Save" button.
    els.save.trigger('click');

    // Capture outoing PUT request.
    var request = _t.getLastRequest();
    var params = $.parseJSON(request.requestBody);

    // Check method and route.
    expect(request.method).toEqual('PUT');
    expect(request.url).toEqual('/neatline/record/'+id);

    // Check the query string for updated values.
    expect(params.title).           toEqual('title2');
    expect(params.body).            toEqual('body2');
    expect(params.coverage).        toEqual('POINT(3 4)');
    expect(params.vector_color).    toEqual('#222222');
    expect(params.stroke_color).    toEqual('#555555');
    expect(params.select_color).    toEqual('#888888');
    expect(params.vector_opacity).  toEqual('2');
    expect(params.select_opacity).  toEqual('5');
    expect(params.stroke_opacity).  toEqual('8');
    expect(params.image_opacity).   toEqual('11');
    expect(params.stroke_width).    toEqual('14');
    expect(params.point_radius).    toEqual('17');
    expect(params.point_image).     toEqual('file2.png');
    expect(params.min_zoom).        toEqual('20');
    expect(params.max_zoom).        toEqual('23');
    expect(params.map_focus).       toEqual('200,300');
    expect(params.map_zoom).        toEqual('24');

  });

  it('should flash a notification when the save succeeds', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked and the request is successful, a
    // success notification should be displayed.
    // --------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'success');

    // Click on "Save".
    els.save.trigger('click');
    _t.respondLast200('');

    // Check for `toastr` call.
    expect(toastr.success).toHaveBeenCalledWith(
      STRINGS.record.save.success, null, _t.vw.record.options.toastr
    );

  });

  it('should flash a notification when the save fails', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked and the request fails, a failure
    // notification should be displayed.
    // --------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'error');

    // Click on "Save".
    els.save.trigger('click');
    _t.respondLast500();

    // Check for `toastr` call.
    expect(toastr.error).toHaveBeenCalledWith(
      STRINGS.record.save.error, null, _t.vw.record.options.toastr
    );

  });

});
