
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * An individual tag.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Tag', function(
  Tag, Neatline, Backbone, Marionette, $, _) {


  Tag.Model = Backbone.Model.extend({
    url: function() {
      if (this.get('id')) return __editor.api.tag+'/'+this.get('id');
      else return __editor.api.tags;
    }
  });


});
