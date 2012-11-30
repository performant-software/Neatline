
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Neatline editor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor = new Backbone.Marionette.Application();


// --------------------
// Instance namespaces.
// --------------------

Editor.Modules = {};
Editor.Collections = {};
Editor.Views = {};


// -------------------
// Application events.
// -------------------

// Initialize application globals.
Editor.on('initialize:before', function() {
  Editor.global = {
    formOpen:   false,
    mapMirror:  false
  };
});

// Start Neatline after editor.
Editor.on('initialize:after', function() {
  Neatline.start();
});

// Start geometry module after Neatline.
Neatline.on('initialize:after', function() {
  Editor.Modules.Geometry.init();
});
