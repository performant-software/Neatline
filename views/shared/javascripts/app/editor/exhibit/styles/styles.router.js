
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Styles controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Styles', function(
  Styles, Neatline, Backbone, Marionette, $, _) {


  Styles.Router = Neatline.Editor.Router.extend({


    routes: {
      'styles': 'styles'
    },


    /**
     * Show the exhibit defaults form.
     */
    'styles': function() {
      Neatline.execute('EXHIBIT:display', ['ETABS', 'STYLES']);
      Neatline.execute('ETABS:activateTab', 'styles');
    }


  });


});
