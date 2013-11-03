
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Spy on `Neatline.vent.trigger`.
   */
  NL.getEventSpy = function() {
    return spyOn(Neatline.vent, 'trigger').andCallThrough();
  };


  /**
   * Spy on `Neatline.execute`.
   */
  NL.getCommandSpy = function() {
    return spyOn(Neatline, 'execute').andCallThrough();
  };


  return NL;


})(NL || {});
