
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Neatline editor initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', { startWithParent: false,
  define: function(Editor, Neatline, Backbone, Marionette, $, _) {


  /**
   * Start the editor before Neatline. This ensures that the editor layout
   * routine sets non-zero dimensions on the map container before Neatline
   * starts OpenLayers, which needs a space-occupying div.
   */
  Neatline.on('initialize:before', function() {
    Editor.start();
  });


  /**
   * Initialize the router and layout view.
   */
  Editor.addInitializer(function() {
    this.__view   = new Editor.View({ el: 'body' });
    this.__router = new Editor.Router();
  });


  /**
   * Start history when all editor modules are running.
   */
  Editor.on('start', function() {
    Backbone.history.start();
  });


  /**
   * Stop the router.
   */
  Editor.addFinalizer(function() {
    Backbone.history.stop();
  });


}});
