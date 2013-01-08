
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Collection of tags.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Tag', function(
  Tag, Neatline, Backbone, Marionette, $, _) {


  Tag.Collection = Backbone.Neatline.SyncCollection.extend({
    url: function() { return __editor.api.tags; },
    model: Neatline.Tag.Model
  });


});
