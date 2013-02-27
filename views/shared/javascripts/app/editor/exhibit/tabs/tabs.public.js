
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit tabs public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Tabs', function(
  Tabs, Neatline, Backbone, Marionette, $, _) {


  /**
   * Append the Tabs to a container.
   *
   * @param {Object} container: The container element.
   */
  var display = function(container) {
    Tabs.__view.showIn(container);
  };
  Neatline.commands.addHandler('ETABS:display', display);


  /**
   * Set the active tab.
   *
   * @param {String} tab: The tab to activate.
   */
  var activateTab = function(tab) {
    Tabs.__view.activateTab(tab);
  };
  Neatline.commands.addHandler('ETABS:activateTab', activateTab);


});
