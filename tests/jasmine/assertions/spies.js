
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Assert the event aggregator was _not_ called with a given event.
   *
   * @param {Object} spy: A spy on `Neatline.vent.trigger`.
   * @param {String} event: The event.
   */
  NL.assertEventNotCalled = function(spy, event) {
    var calls = _.map(spy.calls, function(call) { return call.args[0] });
    expect(_.contains(calls, event)).toBeFalsy();
  };


  return NL;


})(NL || {});
