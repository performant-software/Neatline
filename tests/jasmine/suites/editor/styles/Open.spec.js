
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Styles Open', function() {


  beforeEach(function() {
    _t.loadEditor();
  });


  it('should populate form with exhibit data', function() {

    // --------------------------------------------------------------------
    // When the "Styles" is displayed, the form should load exhibit data.
    // --------------------------------------------------------------------

    _t.navigate('styles');
    _t.respondLast200(_t.json.Styles.exhibit);

    // Form should be populated.
    expect(_t.vw.STYLES.styles.getSession().getValue()).toEqual('1');
    expect(_t.vw.STYLES.$('input[name="map-focus"]').val()).toEqual('2');
    expect(_t.vw.STYLES.$('input[name="map-zoom"]').val()).toEqual('3');

  });


});
