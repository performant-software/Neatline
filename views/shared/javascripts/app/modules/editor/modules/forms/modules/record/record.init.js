
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Forms.Record', function(
  Record, Forms, Backbone, Marionette, $, _) {


  /**
   * Instantiate the record form view.
   */
  Record.addInitializer(function() {
    this.view = new Record.Views.RecordForm({ el: '#editor'});
  });


});
