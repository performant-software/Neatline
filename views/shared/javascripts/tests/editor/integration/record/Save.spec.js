
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

    // Open form.
    var recordRows = _t.getRecordRows();
    $(recordRows[0]).trigger('click');

  });

  // it('should generate a well-formed PUT request', function() {

  //   // --------------------------------------------------------------------
  //   // When the user clicks the "Save" button at the bottom of the edit
  //   // form for a record, the form should gather the updated values from
  //   // the input fields and issue a PUT request to the records API with
  //   // the new data.
  //   // --------------------------------------------------------------------

  //   // Get the id of the form model.
  //   var id = _t.formView.model.get('id');

  //   // Enter new values into the inputs.
  //   _t.textTabView.title.           val('title2');
  //   _t.textTabView.body.            val('body2');
  //   _t.styleTabView.vectorColor.    val('#222222');
  //   _t.styleTabView.strokeColor.    val('#555555');
  //   _t.styleTabView.selectColor.    val('#888888');
  //   _t.styleTabView.vectorOpacity.  val('2');
  //   _t.styleTabView.selectOpacity.  val('5');
  //   _t.styleTabView.strokeOpacity.  val('8');
  //   _t.styleTabView.imageOpacity.   val('11');
  //   _t.styleTabView.strokeWidth.    val('14');
  //   _t.styleTabView.pointRadius.    val('17');
  //   _t.styleTabView.minZoom.        val('20');
  //   _t.styleTabView.maxZoom.        val('23');
  //   _t.styleTabView.pointImage.     val('file2.png');
  //   _t.spatialTabView.coverage.     val('POINT(3 4)');

  //   // Click "Save" button.
  //   _t.formView.saveButton.trigger('click');

  //   // Capture outoing PUT request.
  //   var request = _t.getLastRequest();
  //   var params = $.parseJSON(request.requestBody);

  //   // Check method and route.
  //   expect(request.method).toEqual('PUT');
  //   expect(request.url).toEqual('/neatline/records/'+id);

  //   // Check the query string for updated values.
  //   expect(params.title).           toEqual('title2');
  //   expect(params.body).            toEqual('body2');
  //   expect(params.vector_color).    toEqual('#222222');
  //   expect(params.stroke_color).    toEqual('#555555');
  //   expect(params.select_color).    toEqual('#888888');
  //   expect(params.vector_opacity).  toEqual(2);
  //   expect(params.select_opacity).  toEqual(5);
  //   expect(params.stroke_opacity).  toEqual(8);
  //   expect(params.image_opacity).   toEqual(11);
  //   expect(params.stroke_width).    toEqual(14);
  //   expect(params.point_radius).    toEqual(17);
  //   expect(params.min_zoom).        toEqual(20);
  //   expect(params.max_zoom).        toEqual(23);
  //   expect(params.coverage).        toEqual('POINT(3 4)');
  //   expect(params.point_image).     toEqual('file2.png');

  // });

  // it('should change button text while request is running', function() {

  //   // --------------------------------------------------------------------
  //   // When the "Save" button is clicked, the button text should change to
  //   // "Saving" while the request is running.
  //   // --------------------------------------------------------------------

  //   // Click on "Save".
  //   _t.formView.saveButton.trigger('click');

  //   // Check for changed button text.
  //   expect(_t.formView.saveButton).toHaveText('Saving');

  //   // Complete request.
  //   _t.respondLast200('');

  //   // Check for restored button text.
  //   expect(_t.formView.saveButton).toHaveText('Save');

  // });

  // it('should flash a notification when the save succeeds', function() {

  //   // --------------------------------------------------------------------
  //   // When the "Save" button is clicked, `noty` should be called when the
  //   // request completes with the correct message string.
  //   // --------------------------------------------------------------------

  //   // Spy on noty.
  //   noty = jasmine.createSpy();

  //   // Click on "Save".
  //   _t.formView.saveButton.trigger('click');
  //   _t.respondLast200('');

  //   // Check for `noty` call.
  //   expect(noty).toHaveBeenCalled();
  //   expect(noty.argsForCall[0][0].text).toEqual(
  //     _t.formView.options.messages.save
  //   );

  // });

});
