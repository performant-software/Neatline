
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', {
  startWithParent: false,
  define: function(Editor) {


    Editor.Controller = Neatline.Shared.Controller.extend({


      slug: 'EDITOR',

      events: [
        { 'ROUTER:before': 'closeModals' }
      ],

      commands: [
        'display',
        'notifySuccess',
        'notifyError',
        'setRoute'
      ],

      requests: [
        'getContainer'
      ],


      /**
       * Create the view.
       */
      init: function() {
        this.view = new Editor.View({ el: 'body' });
      },


      /**
       * Display a list of views in the editor container.
       *
       * @param {Array} views: The views, in display order.
       */
      display: function(views) {

        // Clear the editor container.
        this.view.__ui.editor.children().detach();

        // Show each of the views.
        _.each(views, _.bind(function(v) {
          Neatline.execute(v+':display', this.view.__ui.editor);
        }, this));

      },


      /**
       * Flash a success notification.
       *
       * @param {String} message: The message.
       */
      notifySuccess: function(message) {
        this.view.notifySuccess(message);
      },


      /**
       * Flash an error notification.
       *
       * @param {String} message: The message.
       */
      notifyError: function(message) {
        this.view.notifyError(message);
      },


      /**
       * Update the route hash without adding to the history.
       *
       * @param {String} route: The new route.
       */
      setRoute: function(route) {
        Backbone.history.navigate(route, { replace: true });
      },


      /**
       * Close all open modals.
       */
      closeModals: function() {
        $('.modal').modal('hide');
      },


      /**
       * Return the editor container div.
       *
       * @return {Object}: The container.
       */
      getContainer: function() {
        return this.view.__ui.editor;
      }


    });


  }
});
