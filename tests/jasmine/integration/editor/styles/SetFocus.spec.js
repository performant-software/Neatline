
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Styles | Set Focus', function() {


  var el, fx = {
    exhibit: read('EditorStyles.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showStyles(fx.exhibit);

    el = {
      setFocus: NL.vw.STYLES.$('a[name="set-focus"]')
    };

  });


  it('should populate default focus and zoom', function() {

    // ------------------------------------------------------------------------
    // When the "Use Current Viewport as Default" button is clicked, the map
    // focus and zoom inputs should be populated.
    // ------------------------------------------------------------------------

    NL.setMapCenter(1, 2, 3);
    el.setFocus.trigger('click');

    // Inputs should be updated.
    expect(NL.vw.STYLES.__ui.mapFocus).toHaveValue('1,2');
    expect(NL.vw.STYLES.__ui.mapZoom).toHaveValue('3');

    // Model should be updated.
    expect(NL.vw.STYLES.model.get('map_focus')).toEqual('1,2');
    expect(NL.vw.STYLES.model.get('map_zoom')).toEqual('3');

  });


});
