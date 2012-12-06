
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Records initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records', function(
  Records, Editor, Backbone, Marionette, $, _) {


  /**
   * Instantiate the records collection and view.
   *
   * @return void.
   */
  Records.addInitializer(function() {

    // Construct collection and view.
    this.collection = new Neatline.Collections.Records();
    this.view = new Records.Views.RecordList({ el: '#content' });

    // Get records.
    Neatline.vent.trigger('editor:search:query');

  });


});
