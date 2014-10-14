
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared.Widget', function(Widget) {


  Widget.View = Neatline.Shared.View.extend({


    className: 'widget',


    /**
     * Try to attach the view to an existing element, identified by the `id`
     * attribute on the class definition.
     *
     * @param {Object} options
     */
    constructor: function(options) {

      options = options || {};

      // Attach the view to existing element.
      var el = $('#'+this.id);
      if (el.length) options.el = el;

      Widget.View.__super__.constructor.call(this, options);

    },


    /**
     * Ensure that the container element is appended to the DOM.
     *
     * @param {Object} options
     */
    initialize: function(options) {

      options = options || {};

      // Inject the container, if it isn't already in the DOM.
      if (!$.contains(document, this.el)) {
        this.$el.appendTo($('#neatline-map'));
      }

      Widget.View.__super__.initialize.call(this, options);

    },


  });


});
