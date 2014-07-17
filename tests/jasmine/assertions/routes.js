
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Assert the current route fragment.
   *
   * @param {String} fragment: The route.
   */
  NL.assertRoute = function(fragment) {
    expect(Backbone.history.fragment).toEqual(fragment);
  };


  return NL;


})(NL || {});
