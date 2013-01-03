
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

  // Start editor.
  beforeEach(function() {
    _t.loadEditor();
    _t.openFirstRecordForm();
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
    var els = _t.getRecordFormElements();

    els.title.          val('title2').      trigger('change');
    els.body.           val('body2').       trigger('change');
    els.coverage.       val('POINT(3 4)').  trigger('change');
    els.vectorColor.    val('#222222').     trigger('change');
    els.strokeColor.    val('#555555').     trigger('change');
    els.selectColor.    val('#888888').     trigger('change');
    els.vectorOpacity.  val('2').           trigger('change');
    els.selectOpacity.  val('5').           trigger('change');
    els.strokeOpacity.  val('8').           trigger('change');
    els.imageOpacity.   val('11').          trigger('change');
    els.strokeWidth.    val('14').          trigger('change');
    els.pointRadius.    val('17').          trigger('change');
    els.pointImage.     val('file2.png').   trigger('change');
    els.minZoom.        val('20').          trigger('change');
    els.maxZoom.        val('23').          trigger('change');
    els.mapFocus.       val('200,300').     trigger('change');
    els.mapZoom.        val('24').          trigger('change');

    // Click "Save" button.
    _t.vw.record.__ui.buttons.save.trigger('click');

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

  it('should change button text while request is running', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked, the button text should change to
    // "Saving" while the request is running.
    // --------------------------------------------------------------------

    // Click on "Save".
    _t.vw.record.__ui.buttons.save.trigger('click');

    // Check for changed button text.
    expect(_t.vw.record.__ui.buttons.save).toHaveClass('disabled');

    // Complete request.
    _t.respondLast200('');

    // Check for restored button text.
    expect(_t.vw.record.__ui.buttons.save).not.toHaveClass('disabled');

  });

  // it('should flash a notification when the save succeeds', function() {

  //   // --------------------------------------------------------------------
  //   // When the "Save" button is clicked, `noty` should be called when the
  //   // request completes with the correct message string.
  //   // --------------------------------------------------------------------

  //   // Spy on noty.
  //   noty = jasmine.createSpy();

  //   // Click on "Save".
  //   _t.vw.record.__ui.buttons.save.trigger('click');
  //   _t.respondLast200('');

  //   // Check for `noty` call.
  //   expect(noty).toHaveBeenCalled();
  //   expect(noty.argsForCall[0][0].text).toEqual(
  //     _t.formView.options.messages.save
  //   );

  // });

});
