
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Cursor Interactions', function() {


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should highlight all the features on the layer', function() {

    // --------------------------------------------------------------------
    // When cursor hovers on a feature, all of the features on the layer
    // should be redrawn with the `temporary` render intent.
    // --------------------------------------------------------------------

  });


  it('should unhighlight all the features on the layer', function() {

    // --------------------------------------------------------------------
    // When the cursor leaves a feature, all of the features on the layer
    // should be redrawn with the `default` render intent.
    // --------------------------------------------------------------------

  });


  it('should select all the features on the layer', function() {

    // --------------------------------------------------------------------
    // When a feature is clicked, all of the features on the layer should
    // be redrawn with the `select` render intent.
    // --------------------------------------------------------------------

  });


  it('should unselect all the features on the layer', function() {

    // --------------------------------------------------------------------
    // When the cursor clicks off a feature, all of the features on the
    // layer should be redrawn with the `default` render intent.
    // --------------------------------------------------------------------

  });


});
