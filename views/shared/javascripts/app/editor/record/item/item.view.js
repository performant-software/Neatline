
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
     * TODO|dev
     * Construct the item search.
     */
    buildWidgets: function() {

      // Get the current form model.
      var model = Neatline.request('EDITOR:RECORD:getModel');

      // SELECT2
      this.__ui.search.select2({

        placeholder: 'Search Omeka items',

        ajax: {

          // API endpoint.
          url: Neatline.g.neatline.item_search_api,
          dataType: 'xml',

          // Query parameters.
          data: function(term, page) {
            return { output: 'omeka-xml', search: term, page: page }
          },

          // Parse XML response.
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

            // Get the pagination parameters.
            var pageNumber = $(data).find('pageNumber').first().text();
            var perPage = $(data).find('perPage').first().text();
            var totalResults = $(data).find('totalResults').first().text();

            // Are there more pages to be loaded?
            var more = (pageNumber * perPage) < totalResults;

            return { results: items, more: more };

          }

        }

      });

      // Set the current item.
      this.__ui.search.select2('data', {
        id: model.get('item_id'), text: model.get('item_title')
      });

      // Update the model when a new item is selected.
      this.__ui.search.on('select2-selecting', function(e) {
        model.set({ 'item_id': e.object.id, 'item_title': e.object.text });
      });

    }


  });


}});
