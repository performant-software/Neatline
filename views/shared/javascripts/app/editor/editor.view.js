
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor layout manager.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', { startWithParent: false,
  define: function(Editor, Neatline, Backbone, Marionette, $, _) {


  this.View = Backbone.Neatline.View.extend({


    ui: {
      exhibit:  '#neatline',
      map:      '#neatline-map',
      editor:   '#editor'
    },


    /**
     * Store default editor width, listen for window resize.
     */
    init: function() {

      // Cache starting width.
      this.width = this.__ui.editor.width();

      // Listen for resize.
      this.window = $(window);
      this.window.resize(_.bind(this.position, this));
      this.position();

    },


    /**
     * Fit the exhibit and editor to fill the screen.
     */
    position: function() {

      // Measure window.
      var h = this.window.height();
      var w = this.window.width();

      this.__ui.editor.   css({ height: h, width: this.width });
      this.__ui.map.      css({ height: h, width: w - this.width });
      this.__ui.exhibit.  css({ left: this.width });

    },


    /**
     * Flash a success notification.
     *
     * @param {String} string: The message.
     */
    notifySuccess: function(string) {
      toastr.info(string);
    },


    /**
     * Flash a failure notification.
     *
     * @param {String} string: The message.
     */
    notifyError: function(string) {
      toastr.error(string);
    }


  });


}});
