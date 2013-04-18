
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


  var el;


  beforeEach(function() {

    _t.loadEditor();
    _t.showRecordForm(_t.json.RecordForm.record);

    el = {
      save: _t.vw.RECORD.$('a[name="save"]')
    };

  });


  it('should issue PUT request when "Save" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked, a well-formed PUT request should
    // be issued to the record API with the new data.
    // --------------------------------------------------------------------

    var id = _t.vw.RECORD.model.id;
    var inputs = _t.getRecordFormElements();
    var widgets = ['Widget2','Widget3'];

    inputs.titleInput.      val('1').           trigger('change');
    inputs.body.            val('2').           trigger('change');
    inputs.itemId.          val('3').           trigger('change');
    inputs.coverage.        val('4').           trigger('change');
    inputs.tags.            val('5').           trigger('change');
    inputs.widgets.         val(widgets).       trigger('change');
    inputs.presenter.       val('Presenter3').  trigger('change');
    inputs.fillColor.       val('#666666').     trigger('change');
    inputs.selectColor.     val('#777777').     trigger('change');
    inputs.strokeColor.     val('#888888').     trigger('change');
    inputs.fillOpacity.     val('9').           trigger('change');
    inputs.selectOpacity.   val('10').          trigger('change');
    inputs.strokeOpacity.   val('11').          trigger('change');
    inputs.strokeWidth.     val('12').          trigger('change');
    inputs.pointRadius.     val('13').          trigger('change');
    inputs.weight.          val('14').          trigger('change');
    inputs.startDate.       val('15').          trigger('change');
    inputs.endDate.         val('16').          trigger('change');
    inputs.pointImage.      val('17').          trigger('change');
    inputs.wmsAddress.      val('18').          trigger('change');
    inputs.wmsLayers.       val('19').          trigger('change');
    inputs.minZoom.         val('20').          trigger('change');
    inputs.maxZoom.         val('21').          trigger('change');
    inputs.showAfterDate.   val('22').          trigger('change');
    inputs.showBeforeDate.  val('23').          trigger('change');
    inputs.mapFocus.        val('24').          trigger('change');
    inputs.mapZoom.         val('25').          trigger('change');

    // Click "Save" button.
    el.save.trigger('click');

    // Route should be /record/:id, method PUT.
    _t.assertLastRequestRoute(Neatline.global.records_api+'/'+id);
    _t.assertLastRequestMethod('PUT');

    // Capture query parameters.
    var params = _t.getLastRequestParams();

    // Check the query string for updated values.
    expect(params.title).             toEqual('1');
    expect(params.body).              toEqual('2');
    expect(params.item_id).           toEqual('3');
    expect(params.coverage).          toEqual('4');
    expect(params.tags).              toEqual('5');
    expect(params.widgets).           toEqual('Widget2,Widget3');
    expect(params.presenter).         toEqual('Presenter3');
    expect(params.fill_color).        toEqual('#666666');
    expect(params.select_color).      toEqual('#777777');
    expect(params.stroke_color).      toEqual('#888888');
    expect(params.fill_opacity).      toEqual('9');
    expect(params.select_opacity).    toEqual('10');
    expect(params.stroke_opacity).    toEqual('11');
    expect(params.stroke_width).      toEqual('12');
    expect(params.point_radius).      toEqual('13');
    expect(params.weight).            toEqual('14');
    expect(params.start_date).        toEqual('15');
    expect(params.end_date).          toEqual('16');
    expect(params.point_image).       toEqual('17');
    expect(params.wms_address).       toEqual('18');
    expect(params.wms_layers).        toEqual('19');
    expect(params.min_zoom).          toEqual('20');
    expect(params.max_zoom).          toEqual('21');
    expect(params.show_after_date).   toEqual('22');
    expect(params.show_before_date).  toEqual('23');
    expect(params.map_focus).         toEqual('24');
    expect(params.map_zoom).          toEqual('25');

  });


  it('should flash a notification when the save succeeds', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked and the request is successful, a
    // success notification should be displayed.
    // --------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'info');

    // Click on "Save".
    el.save.trigger('click');
    _t.respondLast200('');

    // Should flash success.
    expect(toastr.info).toHaveBeenCalledWith(
      STRINGS.record.save.success
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
    el.save.trigger('click');
    _t.respondLast500();

    // Should flash error.
    expect(toastr.error).toHaveBeenCalledWith(
      STRINGS.record.save.error
    );

  });


  it('should refresh the exhibit when save succeeds', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked and the request succeeds, the
    // exhibit should be refreshed to manifest synchronized styles.
    // --------------------------------------------------------------------

    spyOn(Neatline.vent, 'trigger').andCallThrough();

    // Click on "Save".
    el.save.trigger('click');
    _t.respondLast200('');

    // Should refresh the exhibit.
    expect(Neatline.vent.trigger).toHaveBeenCalledWith('refresh');

  });


});
