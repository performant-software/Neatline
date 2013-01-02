
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Menu command handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Menu', function(
  Menu, Neatline, Backbone, Marionette, $, _) {


  /**
   * Activate a tab.
   *
   * @param {String} tab: The tab to activate.
   */
  Neatline.commands.addHandler('menu:activateTab', function(tab) {
    Menu.__view.activateTab(tab);
  });


});
