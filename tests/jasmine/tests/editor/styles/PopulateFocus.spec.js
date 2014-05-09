
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Styles | Populate Focus', function() {


  var elements, fixtures = {
    exhibit: read('EditorStyles.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showStyles(fixtures.exhibit);

    elements = {
      setFocus: NL.v.styles.$('a[name="set-focus"]')
    };

  });


  it('should populate default focus and zoom', function() {

    // ------------------------------------------------------------------------
    // When the "Use Current Viewport as Default" button is clicked, the map
    // focus and zoom inputs should be populated.
    // ------------------------------------------------------------------------

    NL.setMapCenter(1, 2, 3);
    elements.setFocus.trigger('click');

    // Inputs should be updated.
    expect(NL.v.styles.__ui.mapFocus).toHaveValue('1,2');
    expect(NL.v.styles.__ui.mapZoom).toHaveValue('3');

    // Model should be updated.
    expect(NL.v.styles.model.get('map_focus')).toEqual('1,2');
    expect(NL.v.styles.model.get('map_zoom')).toEqual('3');

  });


});
