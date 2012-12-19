
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

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


    el: window,


    regions: {
      exhibit:  '#neatline',
      map:      '#neatline-map',
      editor:   '#editor'
    },


    /**
     * Get region container divs, measure the width of the editor, listen
     * for window resize, and make starting call to position().
     */
    initialize: function() {

      this.exhibitDiv =   $(this.exhibit.el);
      this.mapDiv =       $(this.map.el);
      this.editorDiv =    $(this.editor.el);

      // Cache default width.
      this.width = this.editorDiv.width();

      // Listen for window resize.
      this.$el.resize(_.bind(this.position, this));
      this.position();

    },


    /**
     * Fit the exhibit and editor to fill the screen.
     */
    position: function() {

      // Measure window.
      var h = this.$el.height();
      var w = this.$el.width();

      // Render the regions.
      this.editorDiv.   css({ height: h, width: this.width });
      this.mapDiv.      css({ height: h, width: w - this.width });
      this.exhibitDiv.  css({ left: this.width });

    }


  });


}});
