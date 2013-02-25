
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Menu public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Menu', function(
  Menu, Neatline, Backbone, Marionette, $, _) {


  /**
   * Append the menu to the editor container.
   */
  var render = function() {
    Menu.__view.showIn(Neatline.request('editor:getContainer'));
  };

  Neatline.commands.addHandler('editor:menu:render', render);


  /**
   * Activate the current tab.
   *
   * @param {String} tab: The tab to activate.
   */
  var update = function(tab) {
    Menu.__view.activateTab(tab);
  };

  Neatline.commands.addHandler('editor:menu:update', update);


});
