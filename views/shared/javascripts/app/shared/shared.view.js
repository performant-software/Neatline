
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared', function(Shared) {


  Shared.View = Backbone.View.extend({


    /**
     * Get the template and UI selections, call the userland initializer.
     */
    initialize: function() {
      this._initTemplate();
      this._initSelections();
      this.init();
    },


    /**
     * Userland initializer.
     * @abstract
     */
    init: function() {
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

      var ui = _.extend({}, this.ui);

      // Walk `ui`:
      _.bind(function select(obj) {
        _.each(obj, _.bind(function(v,k) {

          // If string, select.
          if (typeof v == 'string') {
            obj[k] = this.$el.find(v);
          }

          // If object, recurse.
          else if (typeof v == 'object') {
            _.bind(select, this)(v);
          }

        }, this));
      }, this)(ui);

      this.ui = ui;

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
