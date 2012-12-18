
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form "Style" tab initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Forms.Record.Style', function(
  Style, Record, Backbone, Marionette, $, _) {


  /**
   * Instantiate the "Style" tab view.
   */
  Style.addInitializer(function() {
    this.view = new Neatline.Editor.Forms.Views.StyleTab({
      el: '#record-form-style'
    });
  });


});
