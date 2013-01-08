
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


  Tags.View = Backbone.Neatline.View.extend({


    template:   '#tag-list-template',
    className:  'tags',
    tagName:    'ul',


    /**
     * Compile row template.
     */
    initialize: function() {
      this.tmpl = _.template($(this.template).html());
    },


    /**
     * Render list of tags.
     *
     * @param {Object} tags: The tags collection.
     */
    ingest: function(tags) {
      this.$el.html(this.tmpl({ tags: tags }));
    }


  });


});
