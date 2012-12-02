
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * ------------------------------------------------------------------------
 * Neatline editor.
 * ------------------------------------------------------------------------
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor = new Backbone.Marionette.Application();


/*
 * ------------------------------------------------------------------------
 * Reset global state variables before application start-up.
 * ------------------------------------------------------------------------
 *
 * @return void.
 */
Editor.on('initialize:before', function() {
  Editor.global = {
    formOpen:   false,
    mapMirror:  false
  };
});

/*
 * ------------------------------------------------------------------------
 * Wait until the editor is running before starting Neatine. This ordering
 * is necessary to ensure that the editor layout routine sets non-zero
 * dimensions on the map container before Neatline runs OpenLayers, which
 * needs instantiated on a space-occupying div.
 * ------------------------------------------------------------------------
 *
 * @return void.
 */
Editor.on('initialize:after', function() {
  Neatline.start();
});

/*
 * ------------------------------------------------------------------------
 * Wait until Neatline is running before initializing the geometry editing
 * module, which needs the application map view to be running.
 * ------------------------------------------------------------------------
 *
 * @return void.
 */
Neatline.on('initialize:after', function() {
  Editor.Modules.Geometry.init();
});
