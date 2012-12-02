
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Geometry initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Geometry', { startWithParent: false,
  define: function(Geometry, Editor, Backbone, Marionette, $, _) {


  /*
   * ----------------------------------------------------------------------
   * Alias the exhibit map view.
   * ----------------------------------------------------------------------
   *
   * @return void.
   */
  Geometry.addInitializer(function() {
    this.view = Neatline.Map.view;
  });


}});
