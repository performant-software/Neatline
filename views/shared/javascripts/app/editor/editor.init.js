
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
   * Start the editor before Neatline.
   */
  Neatline.on('initialize:before', function() {
    Editor.start();
  });


  /**
   * Start the map editor after Neatline.
   */
  Neatline.on('initialize:after', function() {
    Editor.Map.start();
    Backbone.history.start();
  });


  /**
   * Initialize the router and layout view.
   */
  Editor.init = function() {
    this.__view   = new Editor.View({ el: 'body' });
    this.__router = new Editor.Router();
  };

  Editor.addInitializer(Editor.init);


}});
