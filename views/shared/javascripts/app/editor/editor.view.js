
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


  Editor.View = Backbone.View.extend({


    el: 'body',


    /**
     * Bind position routine to window resize, do initial position.
     */
    initialize: function() {

      this.window =   $(window);
      this.exhibit =  this.$('#neatline');
      this.map =      this.$('#neatline-map');
      this.editor =   this.$('#editor');

      // Cache starting width.
      this.width = this.editor.width();

      // Listen for window resize.
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

      this.editor.    css({ height: h, width: this.width });
      this.map.       css({ height: h, width: w - this.width });
      this.exhibit.   css({ left: this.width });

    }


  });


}});
