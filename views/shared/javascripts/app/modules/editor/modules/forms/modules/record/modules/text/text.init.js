
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form "Text" tab initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Forms.Record.Text', function(
  Text, Record, Backbone, Marionette, $, _) {


  /**
   * Instantiate the "Text" tab view.
   */
  Text.addInitializer(function() {
    this.view = new Neatline.Editor.Forms.Views.TextTab();
  });


});
