
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Styles controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Styles', function(
  Styles, Neatline, Backbone, Marionette, $, _) {


  Styles.Router = Backbone.Router.extend({


    routes: {
      'styles': 'styles'
    },


    before: function() {
      Neatline.vent.trigger('editor:router:before');
    },


    /**
     * Show the exhibit defaults form.
     */
    'styles': function() {
      Neatline.execute('editor:display', ['menu', 'styles']);
      Neatline.execute('editor:menu:activateTab', 'styles');
    }


  });


});
