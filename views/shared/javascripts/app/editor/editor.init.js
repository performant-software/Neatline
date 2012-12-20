
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
   * Wait until Neatline is running before starting the geometry module,
   * which needs the application map view to be running.
   */
  Neatline.on('initialize:after', function() {
    Editor.Geometry.start();
  });


  /**
   * Start listening for route changes when editor components are running.
   */
  Editor.on('start', function() {
    Backbone.history.start();
  });


  /**
   * Initialize events and commands aggregators, layout view, and router.
   */
  Editor.addInitializer(function() {
    Editor.events = new Backbone.Marionette.EventAggregator();
    Editor.orders = new Backbone.Wreqr.Commands();
    Editor.layout = new Editor.Layout();
    Editor.router = new Editor.Router();
  });


  /**
   * Stop the router.
   */
  Editor.addFinalizer(function() {
    Backbone.history.stop();
  });


}});
