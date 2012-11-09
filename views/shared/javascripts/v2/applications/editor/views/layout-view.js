/**
 * Layout manager view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

NeatlineEditor.Views.Layout = Backbone.View.extend({

  options: {
    width: 300
  },

  /*
   * Get markup.
   *
   * @return void.
   */
  initialize: function() {

    // Getters.
    this.window =   $(window);
    this.body =     $('body');
    this.exhibit =  $('#neatline');
    this.map =      $('#neatline-map');
    this.editor =   $('#editor');

    // Listen for resize and drag.
    this.window.resize(_.bind(this.position, this));
    this.position();

    // Run exhibit.
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
    var w = this.options.width;
    this.editor.css({ height: height, width: w });
    this.map.css({ height: height, width: width-w });
    this.exhibit.css({ left: w });

  }

});
