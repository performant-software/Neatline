
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Initialize Default Focus', function() {


  beforeEach(function() {
    NL.loadNeatline('NeatlineMapInitDefaultFocus.html');
  });


  it('should apply the exhibit default focus', function() {

    // ------------------------------------------------------------------------
    // When the exhibit starts, the focus defined by `map_focus` should be
    // manifested on the map.
    // ------------------------------------------------------------------------

    NL.assertMapFocus(1, 2);
    NL.assertMapZoom(10);

  });


});
