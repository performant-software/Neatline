
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tags list event handlers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Tags', function(
  Tags, Neatline, Backbone, Marionette, $, _) {


  // ======================================================================

  /**
   * Udpate the tags collection and render the list.
   */
  var show = function() {
    Tags.__collection.fetch({ success: function(tags) {
      Tags.__view.ingest(tags);
    }});
  };

  Neatline.vent.on('editor:router:#tags', show);


  // ======================================================================


});
