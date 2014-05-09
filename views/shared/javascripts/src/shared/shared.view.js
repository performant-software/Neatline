
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared', function(Shared) {


  Shared.View = Backbone.View.extend({


    /**
     * Get the template and UI selections, call the userland initializer.
     *
     * @param {Object} options
     */
    initialize: function(options) {
      this._initTemplate();
      this._initSelections();
      this.init(options);
    },


    /**
     * Userland initializer.
     *
     * @param {Object} options
     */
    init: function(options) {
      // NO-OP
    },


    /**
     * Compile and inject the underscore template.
     */
    _initTemplate: function() {
      if (this.template) {
        this.$el.append(_.template($(this.template).html()));
      }
    },


    /**
     * Perform the selections defined on the `ui` hash.
     */
    _initSelections: function() {

      // Copy `ui` -> `__ui`.
      this.__ui = _.extend({}, this.ui);

      // Select the values recursively.
      _.bind(function select(obj) {
        _.each(obj, _.bind(function(v,k) {

          // If string, select.
          if (_.isString(v)) obj[k] = this.$el.find(v);

          // If object, recurse.
          else if (_.isObject(v)) _.bind(select, this)(v);

        }, this));
      }, this)(this.__ui);

    },


    /**
     * Append the view to a container element.
     *
     * @param {Object} container: The container.
     */
    showIn: function(container) {
      this.$el.appendTo(container);
    }


  });


});
