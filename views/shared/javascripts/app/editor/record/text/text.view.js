
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Text', { startWithParent: false,
  define: function(Text) {


  Text.View = Neatline.Shared.View.extend({


    events: {
      'click a[data-textarea]': 'onEditHtmlClick'
    },

    ui: {
      item:   'input[name="item-id"]',
      title:  'textarea[name="title"]',
      body:   'textarea[name="body"]'
    },


    /**
     * Construct the item search box.
     */
    buildWidgets: function() {

      // AUTOCOMPLETE
      this.ui.item.autocomplete({
        source: _.bind(this.onSearch, this),
        select: _.bind(this.onSelect, this)
      });

    },


    /**
     * Query for items.
     *
     * @param {Object} req: The search request, with `term` key.
     * @param {Function} res: Callback that takes autocomplete options.
     */
    onSearch: function(req, res) {

      // Request items.
      $.get(Neatline.g.neatline.items_api, {
        output: 'omeka-xml',
        search: req.term
      }, function(xml) {

        var items = [];

        // Walk items.
        $(xml).find('item').each(function(i, item) {
          items.push({
            label: $(item).find('*[elementId="50"] text').first().text(),
            value: $(item).attr('itemId')
          });
        });

        res(items);

      });
    },


    /**
     * Bind item choice, disable editors.
     *
     * @param {Object} event: The select event.
     * @param {Object} ui: The option.
     */
    onSelect: function(event, ui) {
      this.ui.title.val(ui.item.label).change();
      this.ui.item.val(ui.item.value).change();
    },


    /**
     * Display a fullscreen CKEditor for a textarea.
     *
     * @param {Object} e: The click event.
     */
    onEditHtmlClick: function(e) {

      // Instantiate the editor.
      var id = $(e.target).attr('data-textarea');
      var ckeditor = CKEDITOR.replace(id);
      var textarea = $('#'+id);

      // When the editor is started.
      ckeditor.on('instanceReady', function() {

        // Maximize by default.
        ckeditor.execCommand('maximize');

        // Destroy on minimize.
        ckeditor.on('maximize', function() {
          ckeditor.destroy();
          textarea.change();
        });

      });

    }


  });


}});
