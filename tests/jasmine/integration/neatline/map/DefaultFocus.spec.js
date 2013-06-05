
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Default Focus', function() {


  beforeEach(function() {
    loadFixtures('neatline-partial.html');
  });


  it('should set exhibit default focus and zoom', function() {

    // --------------------------------------------------------------------
    // When the exhibit starts, the viewport defined by the `map_focus`
    // and `map_zoom` should be manifested on the map.
    // --------------------------------------------------------------------

    Neatline.g.neatline.exhibit.map_focus = '1,2';
    Neatline.g.neatline.exhibit.map_zoom = 10;

    NL.startApplication();
    NL.aliasNeatline();

    NL.assertMapViewport(1, 2, 10);

  });


});
