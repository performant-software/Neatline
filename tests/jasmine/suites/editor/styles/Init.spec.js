
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
    _t.stopApplication();
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

    // Start form module.
    Neatline.Editor.Exhibit.Styles.start();
    var view = Neatline.Editor.Exhibit.Styles.__view;

    // Form should be populated.
    expect(view.__ui.styles.val()).toEqual('1');
    expect(view.$('input[name="map-focus"]').val()).toEqual('2');
    expect(view.$('input[name="map-zoom"]').val()).toEqual('3');

  });


});
