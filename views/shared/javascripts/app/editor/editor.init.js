
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Neatline editor initializer. Enforces the correct startup sequence:
 * Editor => Neatline => Geometry module.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', { startWithParent: false,
  define: function(Editor, Neatline, Backbone, Marionette, $, _) {


  /**
   * Start the editor before running Neatline. This ordering is necessary
   * to ensure that the editor layout retine sets non-zero dimensions on
   * the map container before Neatline starts OpenLayers, which needs to
   * be instantiated on a space-occupying div.
   */
  Neatline.on('initialize:before', function() {
    Editor.start();
  });


  /**
   * Initialize events and commands aggregators, layout view, and router.
   */
  Editor.addInitializer(function() {
    this._layout = new Editor.Layout();
    this._router = new Editor.Router();
  });


  /**
   * Start listening for route changes when editor components are running.
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
