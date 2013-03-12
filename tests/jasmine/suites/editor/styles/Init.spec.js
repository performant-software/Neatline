
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Styles initialization tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Styles Initialization', function() {


  beforeEach(function() {
    _t.setFixturesPath();
    loadFixtures('editor-partial.html');
  });


  it('should populate form with exhibit data', function() {

    // --------------------------------------------------------------------
    // When the exhibit starts, the form should be populated with values
    // from `Neatline.global.exhibit`.
    // --------------------------------------------------------------------

    // Mock exhibit.
    Neatline.global.exhibit = {
      styles: '1', map_focus: '2', map_zoom: 3
    };

    // Initialize.
    _t.startApplication();
    _t.navigate('styles');
    _t.aliasEditor();

    // Form should be populated.
    expect(_t.vw.STYLES.styles.getSession().getValue()).toEqual('1');
    expect(_t.vw.STYLES.$('input[name="map-focus"]').val()).toEqual('2');
    expect(_t.vw.STYLES.$('input[name="map-zoom"]').val()).toEqual('3');

  });


});
