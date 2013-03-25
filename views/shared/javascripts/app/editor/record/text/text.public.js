
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Text tab public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Text', { startWithParent: false,
  define: function(Text, Neatline, Backbone, Marionette, $, _) {


  /**
   * Instantiate autocomplete and CKEditor.
   */
  var activate = function() {
    Text.__view.buildWidgets();
  };
  Neatline.commands.setHandler('TEXT:activate', activate);
  Neatline.vent.on('RECORD:tab:text', activate);


}});
