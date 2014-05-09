
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Styles', function(Styles) {


  Styles.Controller = Neatline.Shared.Controller.extend({


    slug: 'EDITOR:EXHIBIT:STYLES',

    commands: ['display'],


    /**
     * Create the router and view.
     */
    init: function() {
      this.router = new Styles.Router();
      this.view = new Styles.View();
    },


    /**
     * Display the form, load fresh exhibit data.
     *
     * @param {Object} container: The container element.
     */
    display: function(container) {

      // Display the view.
      this.view.showIn(container);

      // Build the CSS editor.
      this.view.model.fetch({ success: _.bind(function() {
        this.view.buildEditor();
      }, this)})

    }


  });


});
