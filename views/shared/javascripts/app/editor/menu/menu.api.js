
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
  var activateRecords = function() {
    Menu.__view.activateTab('records');
  };

  Neatline.commands.addHandler('editor:menu:records', activateRecords);
  Neatline.vent.on('editor:router:#records', activateRecords);


  /**
   * Activate "Stylesheet" tab.
   */
  var activateStyles = function() {
    Menu.__view.activateTab('styles');
  };

  Neatline.commands.addHandler('editor:menu:styles', activateStyles);
  Neatline.vent.on('editor:router:#styles', activateStyles);


  /**
   * Activate "Exhibit" tab.
   */
  var activateExhibit = function() {
    Menu.__view.activateTab('exhibit');
  };

  Neatline.commands.addHandler('editor:menu:exhibit', activateExhibit);
  Neatline.vent.on('editor:router:#exhibit', activateExhibit);


});
