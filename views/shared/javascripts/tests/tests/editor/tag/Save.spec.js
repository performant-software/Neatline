
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for tag save.
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
    _t.openTagForm();

    els = {
      save: _t.vw.tag.$('a[name="save"]'),
    };

  });

  it('should generate a well-formed PUT request', function() {

    // --------------------------------------------------------------------
    // When the user clicks the "Save" button at the bottom of the edit
    // form for a tag, the form should gather the updated values and issue
    // a PUT request to the tags API with the new data.
    // --------------------------------------------------------------------

    // Get the model id and elements.
    var id = _t.vw.tag.model.get('id');
    var inputs = _t.getTagFormElements();

    inputs.tag.             val('tag1NEW').           trigger('change');
    inputs.vectorColor.     prop('checked', true).    trigger('change');
    inputs.strokeColor.     prop('checked', false).   trigger('change');
    inputs.selectColor.     prop('checked', true).    trigger('change');
    inputs.vectorOpacity.   prop('checked', false).   trigger('change');
    inputs.selectOpacity.   prop('checked', true).    trigger('change');
    inputs.strokeOpacity.   prop('checked', false).   trigger('change');
    inputs.imageOpacity.    prop('checked', true).    trigger('change');
    inputs.strokeWidth.     prop('checked', false).   trigger('change');
    inputs.pointRadius.     prop('checked', true).    trigger('change');
    inputs.pointImage.      prop('checked', false).   trigger('change');
    inputs.minZoom.         prop('checked', true).    trigger('change');
    inputs.maxZoom.         prop('checked', false).   trigger('change');
    inputs.mapFocus.        prop('checked', true).    trigger('change');
    inputs.mapZoom.         prop('checked', false).   trigger('change');

    // Click "Save" button.
    els.save.trigger('click');

    // Capture outoing PUT request.
    var request = _t.getLastRequest();
    var params = $.parseJSON(request.requestBody);

    // Check method and route.
    expect(request.method).toEqual('PUT');
    expect(request.url).toEqual(__editor.api.tag+'/'+id);

    // Check the query string for updated values.
    expect(params.tag).             toEqual('tag1NEW');
    expect(params.vector_color).    toEqual(1);
    expect(params.stroke_color).    toEqual(0);
    expect(params.select_color).    toEqual(1);
    expect(params.vector_opacity).  toEqual(0);
    expect(params.select_opacity).  toEqual(1);
    expect(params.stroke_opacity).  toEqual(0);
    expect(params.image_opacity).   toEqual(1);
    expect(params.stroke_width).    toEqual(0);
    expect(params.point_radius).    toEqual(1);
    expect(params.point_image).     toEqual(0);
    expect(params.min_zoom).        toEqual(1);
    expect(params.max_zoom).        toEqual(0);
    expect(params.map_focus).       toEqual(1);
    expect(params.map_zoom).        toEqual(0);

  });

  // it('should flash a notification when the save succeeds', function() {

  //   // --------------------------------------------------------------------
  //   // When the "Save" button is clicked and the request is successful, a
  //   // success notification should be displayed.
  //   // --------------------------------------------------------------------

  //   // Spy on toaster.
  //   spyOn(toastr, 'info');

  //   // Click on "Save".
  //   els.save.trigger('click');
  //   _t.respondLast200('');

  //   // Check for `toastr` call.
  //   expect(toastr.info).toHaveBeenCalledWith(
  //     STRINGS.record.save.success, null, _t.vw.record.options.toastr
  //   );

  // });

  // it('should flash a notification when the save fails', function() {

  //   // --------------------------------------------------------------------
  //   // When the "Save" button is clicked and the request fails, a failure
  //   // notification should be displayed.
  //   // --------------------------------------------------------------------

  //   // Spy on toaster.
  //   spyOn(toastr, 'error');

  //   // Click on "Save".
  //   els.save.trigger('click');
  //   _t.respondLast500();

  //   // Check for `toastr` call.
  //   expect(toastr.error).toHaveBeenCalledWith(
  //     STRINGS.record.save.error, null, _t.vw.record.options.toastr
  //   );

  // });

});
