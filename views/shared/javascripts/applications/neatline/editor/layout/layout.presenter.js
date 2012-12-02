
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Layout presenter.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Layout', function(
  Layout, Editor, Backbone, Marionette, $, _) {


  /*
   * ----------------------------------------------------------------------
   * Instantiate the layout view.
   * ----------------------------------------------------------------------
   *
   * @return void.
   */
  Layout.addInitializer(function() {
    this.view = new Neatline.Editor.Layout.Views.Layout();
  });


});
