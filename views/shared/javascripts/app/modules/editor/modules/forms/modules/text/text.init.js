
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * "Text" tab initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Form.TextTab', function(
  TextTab, Form, Backbone, Marionette, $, _) {


  /**
   * Instantiate the "Text" tab view.
   *
   * @return void.
   */
  TextTab.addInitializer(function() {
    this.view = new TextTab.Views.Tab({ el: '#form-text' });
  });


});
