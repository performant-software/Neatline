
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * An individual tag.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Shared.Tag', function(
  Tag, Neatline, Backbone, Marionette, $, _) {


  Tag.Model = Backbone.Model.extend({


    /**
     * Construct the url. If `id` is defined (if the tag has been saved),
     * point to the `tag` API; otherwise, point to the collection API.
     *
     * @return {String}: The url.
     */
    url: function() {
      if (this.get('id')) return __editor.api.tag+'/'+this.get('id');
      else return __editor.api.tags;
    },


    /**
     * When a boolean value is set on the model, cast to value to 0/1.
     */
    set: function(key, val, options) {
      if (_.isBoolean(val)) val = val ? 1 : 0;
      return Backbone.Model.prototype.set.call(this, key, val, options);
    }


  });


});
