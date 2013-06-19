
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Styles | Open Form', function() {


  var fx = {
    exhibit: read('EditorStyles.json')
  };


  beforeEach(function() {
    NL.loadEditor();
  });


  it('should populate form with exhibit data', function() {

    // --------------------------------------------------------------------
    // When the "Styles" is displayed, the form should load exhibit data.
    // --------------------------------------------------------------------

    NL.navigate('styles');
    NL.respondLast200(fx.exhibit);

    // Form should be populated.
    expect(NL.vw.STYLES.styles.getSession().getValue()).toEqual('1');
    expect(NL.vw.STYLES.$('input[name="map-focus"]').val()).toEqual('2');
    expect(NL.vw.STYLES.$('input[name="map-zoom"]').val()).toEqual('3');

  });


});
