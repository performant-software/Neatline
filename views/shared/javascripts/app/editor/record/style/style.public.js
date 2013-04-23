
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Style', { startWithParent: false,
  define: function(Style, Neatline, Backbone, Marionette, $, _) {


  /**
   * Instantiate color pickers and integer draggers.
   */
  var activate = function() {
    Style.__view.buildWidgets();
  };
  Neatline.commands.setHandler(this.ID+':activate', activate);
  Neatline.vent.on('EDITOR:RECORD:#style', activate);


}});
