
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Item', { startWithParent: false,
  define: function(Item) {


  Item.View = Neatline.Shared.View.extend({


    events: {

      // Build UI widgets when tab is shown.
      'shown.bs.tab a[data-slug="item"]': 'buildWidgets',

    },

    ui: {
      search: 'input[name="item-search"]'
    },


    /**
     * Construct the item search.
     */
    buildWidgets: function() {

      // TODO|dev
      // SELECT2
      this.__ui.search.select2({

        placeholder: 'Search Omeka items',
        minimumInputLength: 3,

        ajax: {

          url: Neatline.g.neatline.item_search_api,
          dataType: 'xml',

          data: function(term, page) {
            return {
              output: 'omeka-xml',
              search: term
            }
          },

          results: function(data) {

            var items = [];

            // Walk each item in the result set.
            $(data).find('item').each(function(i, item) {

              // Query for the title.
              var title = $(item).find(
                'item > elementSetContainer element[elementId="50"] text'
              ).first().text();

              // Query for the item id.
              var itemId = $(item).attr('itemId');

              // Add the list item.
              items.push({ id: itemId, text: title });

            });

            return { results: items };

          }

        }

      });

    }


  });


}});
