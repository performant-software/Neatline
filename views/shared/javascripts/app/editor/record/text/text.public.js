
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Styles public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Text', function(
  Text, Neatline, Backbone, Marionette, $, _) {


  /**
   * Append the form to the editor container.
   *
   * @param {Object} container: The container element.
   */
  var display = function(container) {
    Text.__view.showIn(container);
  };
  Neatline.commands.addHandler('TEXT:display', display);


});
