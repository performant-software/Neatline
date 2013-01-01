
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Records list initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  Records.init = function() {

    // Instantiate collection and view.
    this.__collection = new Neatline.Record.Collection();
    this.__view = new Records.ListView();

    // Execute default search query.
    Neatline.execute('editor:loadRecords');

  };

  Records.addInitializer(Records.init);


});
