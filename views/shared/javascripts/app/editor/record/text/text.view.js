
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Text tab form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Text', { startWithParent: false,
  define: function(Text, Neatline, Backbone, Marionette, $, _) {


  Text.View = Backbone.Neatline.View.extend({


    events: {
      'shown ul.nav a': 'onTabChange',
    },

    ui: {
      itemTitle:  'input[name="item-title"]',
      itemId:     'input[name="item-id"]'
    },


    /**
     * Construct the item search box.
     */
    onTabChange: function() {
      this.__ui.itemTitle.autocomplete({
        source: _.bind(this.onSearch, this),
        select: _.bind(this.onSelect, this)
      });
    },


    /**
     * Query for items.
     */
    onSearch: function(req, res) {

      // Query for items.
      $.get(Neatline.global.items_api, {
        output: 'omeka-xml', search: req.term
      }, function(xml) {

        var items = [];

        // Walk item nodes.
        $(xml).find('item').each(function(i, item) {

          // Get the item id and title.
          var id = $(item).attr('itemId');
          var title = $(item).find('element[elementId="50"]').
            find('text').first().text();

          // Add to list of options.
          items.push({ label: title, id: id });

        });

        res(items);

      });

    },


    /**
     * Populate the Omeka item id.
     */
    onSelect: function(event, ui) {
      this.__ui.itemId.val(ui.item.id).change();
    }


  });


}});
