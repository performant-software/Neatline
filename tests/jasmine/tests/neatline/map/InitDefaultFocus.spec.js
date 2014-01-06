
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Initialize Default Focus', function() {


  beforeEach(function() {
    NL.loadNeatline('NeatlineMapInitDefaultFocus.html');
  });


  it('should apply the exhibit default focus and zoom', function() {

    // ------------------------------------------------------------------------
    // When the exhibit starts, the viewport defined by the `map_focus` and
    // `map_zoom` should be manifested on the map.
    // ------------------------------------------------------------------------

    NL.assertMapViewport(1, 2, 10);

  });


});
