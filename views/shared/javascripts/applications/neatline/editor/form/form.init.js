
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Form initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Form', function(
  Form, Editor, Backbone, Marionette, $, _) {


  /*
   * ----------------------------------------------------------------------
   * Instantiate the form view.
   * ----------------------------------------------------------------------
   *
   * @return void.
   */
  Form.addInitializer(function() {
    this.view = new Neatline.Editor.Form.Views.Form({ el: '#content' });
  });


});
