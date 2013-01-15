
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for styles save.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Styles Form Save', function() {


  var els;


  beforeEach(function() {

    _t.loadEditor();

    els = {
      save: _t.vw.styles.$('a[name="save"]')
    };

  });


  it('should issue POST request when "Save" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked, the YAML should be saved by way
    // of a POST request issued to the /styles action.
    // --------------------------------------------------------------------

    // Set editor value, click "Save".
    _t.vw.styles.editor.setValue('styles');
    els.save.trigger('click');

    // Capture outoing request.
    var request = _t.getLastRequest();

    // Method should be PUT.
    expect(request.method).toEqual('PUT');

    // URL should be /record/:id.
    expect(request.url).toEqual(__editor.api.styles);

    // Body should be editor value.
    expect(request.requestBody).toEqual('styles');;

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
      STRINGS.styles.save.success, null, _t.vw.editor.options.toastr
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
      STRINGS.styles.save.error, null, _t.vw.editor.options.toastr
    );

  });


  it('should update the map when save succeeds', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked and the request succeeds, the map
    // should be automatically refreshed to manifest the new styles.
    // --------------------------------------------------------------------

    // Click on "Save".
    els.save.trigger('click');
    _t.respondLast200('');

    // Capture outoing request.
    var request = _t.getLastRequest();

    // Request should include map focus.
    expect(request.method).toEqual('GET');
    expect(request.url).toContain(__exhibit.api.records);
    expect(request.url).toContain('extent=');
    expect(request.url).toContain('zoom=');

    // Respond with new data.
    _t.respondLast200(_t.json.records.removed);

    // Record2 point should be removed.
    expect(_t.getVectorLayerByTitle('title2')).toBeUndefined();
    expect(_t.vw.map.layers.length).toEqual(2);

  });


});
