
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Styles | Save Styles', function() {


  var el, fx = {
    exhibit: read('EditorStyles.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showStyles(fx.exhibit);

    el = {
      setFocus: NL.vw.STYLES.$('a[name="set-focus"]'),
      save:     NL.vw.STYLES.$('a[name="save"]')
    };

  });


  it('should synchronize model with stylesheet editor', function() {

    // ------------------------------------------------------------------------
    // When the stylesheet is changed, the model should be updated with a JSON
    // representation of the CSS.
    // ------------------------------------------------------------------------

    NL.vw.STYLES.styles.getSession().setValue('val');
    expect(NL.vw.STYLES.model.get('styles')).toEqual('val');

  });


  it('should issue PUT request when "Save" is clicked', function() {

    // ------------------------------------------------------------------------
    // When the "Save" button is clicked, a well-formed PUT request should be
    // issued to the exhibit API with the new data.
    // ------------------------------------------------------------------------

    NL.vw.STYLES.styles.getSession().setValue('1');
    NL.vw.STYLES.__ui.mapFocus.val('2').trigger('change');
    NL.vw.STYLES.__ui.mapZoom.val('3').trigger('change');

    // Click "Save" button.
    el.save.trigger('click');

    // Route should be /neatline/put/:id, method PUT.
    NL.assertLastRequestRoute(Neatline.g.neatline.exhibits_api);
    NL.assertLastRequestMethod('PUT');

    // Check query string values.
    var params = NL.getLastRequestParams();
    expect(params.styles).toEqual('1');
    expect(params.map_focus).toEqual('2');
    expect(params.map_zoom).toEqual('3');

  });


  it('should flash a notification when the save succeeds', function() {

    // ------------------------------------------------------------------------
    // When the "Save" button is clicked and the request succeeds, a success
    // notification should be displayed.
    // ------------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'info');

    // Click on "Save".
    el.save.trigger('click');
    NL.respondLast200(fx.exhibit);

    // Should flash success.
    expect(toastr.info).toHaveBeenCalledWith(
      STRINGS.exhibit.save.success
    );

  });


  it('should flash a notification when the save fails', function() {

    // ------------------------------------------------------------------------
    // When the "Save" button is clicked and the request fails, a failure
    // notification should be displayed.
    // ------------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'error');

    // Click on "Save".
    el.save.trigger('click');
    NL.respondLast500();

    // Should flash error.
    expect(toastr.error).toHaveBeenCalledWith(
      STRINGS.exhibit.save.error
    );

  });


  it('should refresh the exhibit when save succeeds', function() {

    // ------------------------------------------------------------------------
    // When the "Save" button is clicked and the request succeeds, the exhibit
    // should be refreshed to manifest the new styles on the map.
    // ------------------------------------------------------------------------

    spyOn(Neatline.vent, 'trigger').andCallThrough();

    // Click on "Save".
    el.save.trigger('click');
    NL.respondLast200(fx.exhibit);

    // Should refresh the exhibit.
    expect(Neatline.vent.trigger).toHaveBeenCalledWith('refresh', {
      source: Neatline.Editor.Exhibit.Styles.ID
    });

  });


});
