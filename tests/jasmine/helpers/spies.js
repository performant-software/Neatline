
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Spy on `Neatline.vent.trigger`.
   */
  NL.getEventSpy = function() {
    return spyOn(Neatline.vent, 'trigger').and.callThrough();
  };


  /**
   * Spy on `Neatline.execute`.
   */
  NL.getCommandSpy = function() {
    return spyOn(Neatline, 'execute').and.callThrough();
  };


  return NL;


})(NL || {});
