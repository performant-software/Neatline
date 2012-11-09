/**
 * Layout manager view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

NeatlineEditor.Views.Layout = Backbone.View.extend({

  widths: [20, 300, 600],
  currentIndex: 1,

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
    this.handle =   $('#drag-handle');

    // Trackers.
    this.lines = [];

    // Create guide lines.
    this.createSvgElements();

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
    var w = this.widths[this.currentIndex];
    this.editor.css({ height: height, width: w });
    this.map.css({ height: height, width: width-w });
    this.handle.css({ height: height, left: w });
    this.exhibit.css({ left: w });

    // Render line heights.
    _.each(this.lines, _.bind(function(line) {
      line.attr({ y2: height });
    }, this));

  },

  /*
   * Inject SVG elements.
   *
   * @return void.
   */
  createSvgElements: function() {

    // Inject container.
    this.svg = d3.select('body').append('svg:svg');

    // Create guides.
    _.each(this.widths, _.bind(function(w) {
      var line = this.svg.append('svg:line');
      line.attr({ x1: w, y1: 0, x2: w });
      this.lines.push(line);
    }, this));

  },

  /*
   * Bind drag listener.
   *
   * @param {Object} event: The mousedown event.
   *
   * @return void.
   */
  addDrag: function(event) {

    // Add body class.
    this.body.addClass('dragging');

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

    // Get drag delta.
    var delta = initEvent.pageX - dragEvent.pageX;
    var offset = this.widths[this.currentIndex] - delta;
    this.handle.css('left', offset);

    // Get distances.
    var distances = [];
    _.each(this.widths, function(w, i) {
      distances.push(Math.abs(offset-w));
    });

    // Get new index.
    var newIndex = _.indexOf(distances, _.min(distances));

    // Render line highlight.
    if (newIndex != this.currentIndex) {
      this.lines[newIndex].attr('class', 'highlighted');
      this.lines[this.currentIndex].attr('class', '');
    }

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
    this.body.removeClass('dragging');
  }

});
