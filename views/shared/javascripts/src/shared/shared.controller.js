
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared', function(Shared) {


  Shared.Controller = Marionette.Controller.extend({


    slug: '',

    events: [], commands: [], requests: [],


    /**
     * Bind events and call initializer.
     */
    initialize: function() {

      this._initEvents();
      this._initCommands();
      this._initRequests();

      // Call the userland initalizer.
      this.init.apply(this, arguments);

    },


    /**
     * Userland initializer.
     * @abstract
     */
    init: function() {
      // NO-OP
    },


    /**
     * Pass each event identifier through a binding routine:
     *
     * - If the identifier is a string, bind the event directly to the method
     *   on the controller with the same name.
     *
     * - If the identifier is an object, treat the keys as event names and the
     *   values as the corresponding controller methods.
     *
     * @param {Array} map: A list of strings and/or objects.
     * @param {Function} bind: Bind an event to a method.
     */
    _bind: function(map, bind) {
      _.each(map, function(identifier) {

        // If string, bind to method with same name.
        if (_.isString(identifier)) bind(identifier, identifier);

        else if (_.isObject(identifier)) {

          // If object, bind each event-method pair.
          _.each(identifier, function(v, k) { bind(k, v) });

        }

      });
    },


    /**
     * Bind the `events` hash to the event aggregator.
     */
    _initEvents: function() {
      this._bind(this.events, _.bind(function(e, m) {
        Neatline.vent.on(e, _.bind(this[m], this));
      }, this));
    },


    /**
     * Bind the `commands` hash to the command broker.
     */
    _initCommands: function() {
      this._bind(this.commands, _.bind(function(e, m) {
        Neatline.commands.setHandler(this.slug+':'+e, _.bind(this[m], this));
      }, this));
    },


    /**
     * Bind the `requests` hash to the req/res broker.
     */
    _initRequests: function() {
      this._bind(this.requests, _.bind(function(e, m) {
        Neatline.reqres.setHandler(this.slug+':'+e, _.bind(this[m], this));
      }, this));
    }


  });


});
