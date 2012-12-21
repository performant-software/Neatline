
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tag list view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Tags', function(
  Tags, Neatline, Backbone, Marionette, $, _) {


  Tags.View = Backbone.View.extend({
    className: 'tags',
    tagName: 'ul'
  });


});
