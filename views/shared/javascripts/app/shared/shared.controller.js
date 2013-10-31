
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared', function(Shared) {


  Shared.Controller = Marionette.Controller.extend({


    slug: '',

    events: [], commands: [], requests: [],


    /**
     * Bind events and call the userland initializer.
     */
    initialize: function() {
      this._initEvents();
      this._initCommands();
      this._initRequests();
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
     * Bind methods listed in the `events` hash to the event aggregator.
     */
    _initEvents: function() {
      _.each(this.events, _.bind(function(e) {
        Neatline.vent.on(this.slug+':'+e, _.bind(this[e], this));
      }, this));
    },


    /**
     * Bind methods listed in the `commands` hash to the command broker.
     */
    _initCommands: function() {
      _.each(this.commands, _.bind(function(c) {
        Neatline.commands.setHandler(this.slug+':'+c, _.bind(this[c], this));
      }, this));
    },


    /**
     * Bind methods listed in the `requests` hash to the reqres broker.
     */
    _initRequests: function() {
      _.each(this.requests, _.bind(function(r) {
        Neatline.reqres.setHandler(this.slug+':'+r, _.bind(this[r], this));
      }, this));
    }


  });


});
