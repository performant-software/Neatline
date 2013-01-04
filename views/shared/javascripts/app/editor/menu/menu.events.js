
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


  /**
   * Activate "Tags" tab.
   */
  var activateTags = function() {
    Menu.__view.activateTab('tags');
  };


  Neatline.vent.on('editor:router:#records', activateRecords);
  Neatline.vent.on('editor:router:#tags', activateTags);


});
