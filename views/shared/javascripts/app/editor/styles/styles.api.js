
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Styles event handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Styles', function(
  Styles, Neatline, Backbone, Marionette, $, _) {


  /**
   * Refresh the editor.
   */
  var refresh = function() {
    Styles.__view.refresh();
  };

  Neatline.commands.addHandler('editor:styles:refresh', refresh);
  Neatline.vent.on('editor:router:#stylesheet', refresh);


});
