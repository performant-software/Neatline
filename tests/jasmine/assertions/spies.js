
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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
    var events = _.map(spy.calls.allArgs(), function(a) { return a[0]; });
    expect(_.contains(events, event)).toBeFalsy();
  };


  return NL;


})(NL || {});
