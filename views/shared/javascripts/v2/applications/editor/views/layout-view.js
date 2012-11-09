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

    // Default width.
    this.width = 340;

    // Getters.
    this.window =   $(window);
    this.body =     $('body');
    this.exhibit =  $('#neatline');
    this.map =      $('#neatline-map');
    this.editor =   $('#editor');
    this.handle =   $('#drag-handle');

    // Listen for resize and drag.
    this.window.resize(_.bind(this.position, this));
    this.handle.mousedown(_.bind(this.addDrag, this));
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
    this.editor.css({ height: height, width: this.width });
    this.map.css({ height: height, width: width-this.width });
    this.handle.css({ height: height, left: this.width });
    this.exhibit.css({ left: this.width });

  },

  /*
   * Bind drag listener.
   *
   * @param {Object} event: The mousedown event.
   *
   * @return void.
   */
  addDrag: function(event) {

    // Add drag class.
    this.handle.addClass('dragging');

    this.window.bind({

      // Render drag.
      'mousemove.drag': _.bind(function(e) {
        this.onDragTick(event, e);
      }, this),

      // Remove drag.
      'mouseup.drag': _.bind(function(e) {
        this.onDragComplete(e);
      }, this)

    });

  },

  /*
   * Process drag mousemove.
   *
   * @param {Object} initEvent: The initiating click event.
   * @param {Object} dragEvent: The current mousemove event.
   *
   * @return void.
   */
  onDragTick: function(initEvent, dragEvent) {
    var delta = initEvent.pageX - dragEvent.pageX;
    this.dragWidth = this.width - delta;
    this.handle.css('left', this.dragWidth);
  },

  /*
   * Process drag mouseup.
   *
   * @param {Object} event: The mouseup event.
   *
   * @return void.
   */
  onDragComplete: function(event) {
    this.window.unbind('mousemove.drag');
    this.window.unbind('mouseup.drag');
    this.handle.removeClass('dragging');
    this.width = this.dragWidth;
    this.position();
  }

});
