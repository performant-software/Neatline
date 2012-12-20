
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


  Editor.Layout = Backbone.Marionette.Layout.extend({


    el: 'body',

    ui: {
      exhibit:  '#neatline',
      map:      '#neatline-map',
      editor:   '#editor'
    },

    regions: {
      editor:   '#editor'
    },


    /**
     * Bind position routine to window resize, do initial position.
     */
    initialize: function() {

      // Get elements.
      this.window = $(window);
      this.bindUIElements();

      // Cache starting width.
      this.width = this.ui.editor.width();

      // Listen for window resize.
      this.window.resize(_.bind(this.position, this));
      this.position();

    },


    /**
     * Fit the exhibit and editor to fill the screen.
     */
    position: function(e) {

      // Measure window.
      var h = this.window.height();
      var w = this.window.width();

      // Render the regions.
      this.ui.editor.   css({ height: h, width: this.width });
      this.ui.map.      css({ height: h, width: w - this.width });
      this.ui.exhibit.  css({ left: this.width });

    }


  });


}});
