
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit', function(
  Exhibit, Neatline, Backbone, Marionette, $, _) {


  /**
   * Append the exhibit menu to a container.
   *
   * @param {Object} container: The container element.
   */
  var display = function(container) {
    Exhibit.__view.showIn(container);
  };
  Neatline.commands.addHandler('EXHIBIT:display', display);


  /**
   * Set the active tab.
   *
   * @param {String} tab: The tab to activate.
   */
  var activateTab = function(tab) {
    Exhibit.__view.activateTab(tab);
  };
  Neatline.commands.addHandler('EXHIBIT:activateTab', activateTab);


});
