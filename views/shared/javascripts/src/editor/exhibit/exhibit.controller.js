
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit', function(Exhibit) {


  Exhibit.Controller = Neatline.Shared.Controller.extend({


    slug: 'EDITOR:EXHIBIT',

    commands: [
      'display',
      'activateTab'
    ],


    /**
     * Create the view.
     */
    init: function() {
      this.view = new Exhibit.View();
    },


    /**
     * Append the exhibit menu to a container.
     *
     * @param {Object} container: The container element.
     */
    display: function(container) {
      this.view.showIn(container);
    },


    /**
     * Set the active tab.
     *
     * @param {String} tab: The tab to activate.
     */
    activateTab: function(tab) {
      this.view.activateTab(tab);
    }


  });


});
