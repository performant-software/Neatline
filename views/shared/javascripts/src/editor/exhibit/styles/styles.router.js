
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Styles', function(Styles) {


  Styles.Router = Neatline.Shared.Router.extend({


    routes: {
      'styles': 'styles'
    },


    /**
     * Show the styles form.
     */
    styles: function() {

      Neatline.execute('EDITOR:display', [
        'EDITOR:EXHIBIT',
        'EDITOR:EXHIBIT:STYLES'
      ]);

      Neatline.execute(
        'EDITOR:EXHIBIT:activateTab', 'styles'
      );

    }


  });


});
