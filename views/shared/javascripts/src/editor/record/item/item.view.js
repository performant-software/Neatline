
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Item', {
  startWithParent: false,
  define: function(Item) {


    Item.View = Neatline.Shared.View.extend({


      events: {

        // Build the item search when tab is shown.
        'shown.bs.tab a[data-slug="item"]': 'buildWidgets',

      },

      ui: {
        search: 'input[name="item-search"]'
      },


      /**
       * Construct the item search.
       */
      buildWidgets: function() {

        // Get the current form model.
        this.model = Neatline.request('EDITOR:RECORD:getModel');

        // Cosntruct Select2.
        this.__ui.search.select2({

          placeholder: 'Search Omeka items',
          allowClear: true,

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
              var totalItems = $(data).find('totalResults').first().text();
              var pageLength = $(data).find('perPage').first().text();

              // Do any more pages exist?
              var more = (pageNumber * pageLength) < totalItems;

              return { results: items, more: more };

            }

          }

        });

        // Set current item selection.
        if (this.model.get('item_id')) {
          this.__ui.search.select2('data', {
            id: this.model.get('item_id'), text: this.model.get('item_title')
          });
        }

        // Update item id/title on select.
        this.__ui.search.on('select2-selecting', _.bind(function(e) {
          this.model.set({ item_id: e.object.id, item_title: e.object.text })
          this.model.resetItem();
        }, this));

        // Unset item on clear.
        this.__ui.search.on('select2-removed', _.bind(function(e) {
          this.model.set({ item_id: null, item_title: null })
          this.model.resetItem();
        }, this));

      }


    });


  }
});
