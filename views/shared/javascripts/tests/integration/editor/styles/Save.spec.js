
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


  var els, id;


  beforeEach(function() {

    _t.loadEditor();

    els = {
      save: _t.vw.styles.$('a[name="save"]')
    };

  });


  it('should execute save when "Save" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked, a well-formed POST request with
    // the styles YAML should be issued.
    // --------------------------------------------------------------------

    // Set styles value, save.
    _t.vw.styles.editor.setValue('styles');
    els.save.trigger('click');

    // Capture outoing request.
    var request = _t.getLastRequest();

    // Method should be POST.
    expect(request.method).toEqual('POST');

    // URL should be /styles/:id.
    expect(request.url).toEqual('styles/'+__exhibit.id);

    // Body should be editor value.
    expect(request.requestBody).toEqual('styles');

  });


  it('should flash notification when the save succeeds', function() {

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


  it('should flash notification when the save fails', function() {

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


});
