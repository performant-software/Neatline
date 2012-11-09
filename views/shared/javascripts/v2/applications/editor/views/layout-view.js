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

    // Getters.
    this.window =   $(window);
    this.exhibit =  $('#neatline');
    this.map =      $('#neatline-map');
    this.editor =   $('#editor');
    this.handle =   $('#drag-handle');

    // Render position.
    this.window.resize(_.bind(this.position, this));
    this.position();

    // Start.
    Neatline.start();

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
    this.exhibit.css({ left: width*0.2 });

  }

});
