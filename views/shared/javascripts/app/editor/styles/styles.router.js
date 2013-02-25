
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form controller.
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
      Neatline.execute('editor:empty');
    },


    /**
     * Show the exhibit defaults form.
     */
    'styles': function() {
      Neatline.execute('editor:menu:update', 'styles');
      Neatline.execute('editor:menu:show');
      Neatline.execute('editor:styles:show');
    }


  });


});
