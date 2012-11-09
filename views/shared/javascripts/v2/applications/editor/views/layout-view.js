/**
 * Layout manager view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

NeatlineEditor.Views.Layout = Backbone.View.extend({

  /*
   * Get markup.
   *
   * @return void.
   */
  initialize: function() {

    // Get viewports.
    this.window = $(window);
    this.neatline = $('#neatline');
    this.map = $('#neatline-map');
    this.editor = $('#editor');

    // Listen for resize.
    this.window.resize(_.bind(this.position, this));
    this.position();

  },

  /*
   * Render position.
   *
   * @return void.
   */
  position: function() {

    // Measure document.
    var height = this.window.height();
    var width = this.window.width();

    // Render positions.
    this.editor.css({ height: height, width: width*0.2 });
    this.map.css({ height: height, width: width*0.8 });
    this.neatline.css({ left: width*0.2 });

  }

});
