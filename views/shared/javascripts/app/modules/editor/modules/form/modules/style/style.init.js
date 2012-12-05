
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * "Style" tab initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Form.StyleTab', function(
  StyleTab, Form, Backbone, Marionette, $, _) {


  /**
   * Instantiate the "Style" tab view.
   *
   * @return void.
   */
  StyleTab.addInitializer(function() {
    this.view = new StyleTab.Views.Tab({ el: '#form-style' });
  });


});
