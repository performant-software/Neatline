
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Menu event handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Menu', function(
  Menu, Neatline, Backbone, Marionette, $, _) {


  /**
   * Activate "Records" tab.
   */
  var records = function() {
    Menu.__view.activateTab('records');
  };

  Neatline.commands.addHandler('editor:menu:records', records);
  Neatline.vent.on('editor:router:#records', records);


  /**
   * Activate "Tags" tab.
   */
  var tags = function() {
    Menu.__view.activateTab('tags');
  };

  Neatline.commands.addHandler('editor:menu:tags', tags);
  Neatline.vent.on('editor:router:#tags', tags);


});
