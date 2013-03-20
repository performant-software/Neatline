
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Spatial tab public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Spatial', { startWithParent: false,
  define: function(Spatial, Neatline, Backbone, Marionette, $, _) {


  /**
   * Reset the edit mode to "Navigate", deactivate presenter if spatial
   * tab is active.
   */
  var bind = function() {
    Spatial.__view.resetEditMode();
  };
  Neatline.commands.addHandler('SPATIAL:bind', bind);
  Neatline.vent.on('RECORD:bind', bind);


}});
