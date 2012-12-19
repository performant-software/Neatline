
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * "Spatial" tab initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Form.SpatialTab', function(
  SpatialTab, Form, Backbone, Marionette, $, _) {


  /**
   * Instantiate the "Spatial" tab view.
   */
  SpatialTab.addInitializer(function() {
    this.view = new SpatialTab.Views.Tab({ el: '#form-text' });
  });


});
