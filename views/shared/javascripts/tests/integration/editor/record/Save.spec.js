
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record save.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Save', function() {


  var els;


  beforeEach(function() {

    _t.loadEditor();
    _t.openRecordForm();

    els = {
      save: _t.vw.record.$('a[name="save"]'),
    };

  });


  it('should issue PUT request when "Save" is clicked', function() {

    // --------------------------------------------------------------------
    // When the user clicks the "Save" button at the bottom of the edit
    // form for a record, the form should gather the updated values from
    // the input fields and issue a PUT request with the new data.
    // --------------------------------------------------------------------

    // Get the model id and form elements.
    var id = _t.vw.record.model.get('id');
    var inputs = _t.getRecordFormElements();

    inputs.titleInput.      val('1').       trigger('change');
    inputs.body.            val('2').       trigger('change');
    inputs.itemId.          val('3').       trigger('change');
    inputs.coverage.        val('4').       trigger('change');
    inputs.tags.            val('5').       trigger('change');
    inputs.presenter.       val('None').    trigger('change');
    inputs.vectorColor.     val('#666666'). trigger('change');
    inputs.strokeColor.     val('#777777'). trigger('change');
    inputs.selectColor.     val('#888888'). trigger('change');
    inputs.vectorOpacity.   val('9').       trigger('change');
    inputs.selectOpacity.   val('10').      trigger('change');
    inputs.strokeOpacity.   val('11').      trigger('change');
    inputs.imageOpacity.    val('12').      trigger('change');
    inputs.strokeWidth.     val('13').      trigger('change');
    inputs.pointRadius.     val('14').      trigger('change');
    inputs.pointImage.      val('15').      trigger('change');
    inputs.minZoom.         val('16').      trigger('change');
    inputs.maxZoom.         val('17').      trigger('change');
    inputs.mapFocus.        val('18').      trigger('change');
    inputs.mapZoom.         val('19').      trigger('change');

    // Click "Save" button.
    els.save.trigger('click');

    // Route should be /record/:id, method PUT.
    _t.assertLastRequestRoute(Neatline.global.record_api+'/'+id);
    _t.assertLastRequestMethod('PUT');

    // Capture query parameters.
    var params = _t.getLastRequestParams();

    // Check the query string for updated values.
    expect(params.title).           toEqual('1');
    expect(params.body).            toEqual('2');
    expect(params.item_id).         toEqual('3');
    expect(params.coverage).        toEqual('4');
    expect(params.tags).            toEqual('5');
    expect(params.presenter).       toEqual('None');
    expect(params.vector_color).    toEqual('#666666');
    expect(params.stroke_color).    toEqual('#777777');
    expect(params.select_color).    toEqual('#888888');
    expect(params.vector_opacity).  toEqual('9');
    expect(params.select_opacity).  toEqual('10');
    expect(params.stroke_opacity).  toEqual('11');
    expect(params.image_opacity).   toEqual('12');
    expect(params.stroke_width).    toEqual('13');
    expect(params.point_radius).    toEqual('14');
    expect(params.point_image).     toEqual('15');
    expect(params.min_zoom).        toEqual('16');
    expect(params.max_zoom).        toEqual('17');
    expect(params.map_focus).       toEqual('18');
    expect(params.map_zoom).        toEqual('19');

  });


  it('should flash a notification when the save succeeds', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked and the request is successful, a
    // success notification should be displayed.
    // --------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'info');

    // Click on "Save".
    els.save.trigger('click');
    _t.respondLast200('');

    // `toastr` should be called.
    expect(toastr.info).toHaveBeenCalledWith(
      STRINGS.record.save.success, null, _t.vw.editor.options.toastr
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

    // `toastr` should be called.
    expect(toastr.error).toHaveBeenCalledWith(
      STRINGS.record.save.error, null, _t.vw.editor.options.toastr
    );

  });


  it('should update the map when save succeeds', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked and the request succeeds, the map
    // should be automatically refreshed to manifest synchronized styles.
    // --------------------------------------------------------------------

    // Click on "Save".
    els.save.trigger('click');
    _t.respondLast200('');

    _t.assertMapRefreshed();

  });


});
