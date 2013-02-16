
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit defaults event handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit', function(
  Exhibit, Neatline, Backbone, Marionette, $, _) {


  /**
   * Refresh the editor.
   */
  var refresh = function() {
    Exhibit.__view.refresh();
  };

  Neatline.commands.addHandler('editor:exhibit:refresh', refresh);
  Neatline.vent.on('editor:router:#exhibit', refresh);


});
