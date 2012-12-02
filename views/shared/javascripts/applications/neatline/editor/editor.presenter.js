
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Neatline editor presenter. Hook onto initialization events to enforce
 * the correct startup sequence: Editor => Neatline => Geometry module.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', { startWithParent: false, define: function(
  Editor, Neatline, Backbone, Marionette, $, _) {

  /*
   * ----------------------------------------------------------------------
   * Start the editor before running Neatline. This ordering is necessary
   * to ensure that the editor layout retine sets non-zero dimensions on
   * the map container before Neatline starts OpenLayers, which needs to
   * be instantiated on a space-occupying div.
   * ----------------------------------------------------------------------
   *
   * @return void.
   */
  Neatline.on('initialize:before', function() {
    Editor.start();
  });

  /*
   * ----------------------------------------------------------------------
   * Reset global state variables before application start-up.
   * ----------------------------------------------------------------------
   *
   * @return void.
   */
  Editor.on('initialize:before', function() {
    Editor.global = { formOpen: false, mapMirror: false };
  });

  /*
   * ----------------------------------------------------------------------
   * Wait until Neatline is running before initializing the geometry
   * module, which needs the application map view to be running.
   * ----------------------------------------------------------------------
   *
   * @return void.
   */
  Neatline.on('initialize:after', function() {
    Editor.Geometry.start();
  });

}});
