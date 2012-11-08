/**
 * Map view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.Views.Map = Backbone.View.extend({

  /*
   * Start OpenLayers.
   *
   * @return void.
   */
  initialize: function() {
    this.initializeOpenLayers();
  },

  /*
   * Construct map.
   *
   * @return void.
   */
  initializeOpenLayers: function() {
    this.map = new OpenLayers.Map(this.el);
  }

});
