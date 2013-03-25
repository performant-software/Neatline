
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
      'shown ul.nav a': 'onTabChange'
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
      this.__ui.item.autocomplete({
        source: _.bind(this.onSearch, this),
        select: _.bind(this.onSelect, this)
      });

      var toolbar = [
        [ 'Bold',
          'Italic',
          'Underline',
          'RemoveFormat',
          'NumberedList',
          'BulletedList',
          'Link',
          'Unlink',
          'Image'
        ],
        [
          'Outdent',
          'Indent',
          'FontSize'
        ],
        [
          'Maximize',
          'Source'
        ]
      ];

      // CKEDITOR
      // CKEDITOR.replace('title', {
      //   toolbar: toolbar,
      //   height: 60
      // });
      // CKEDITOR.replace('body', {
      //   toolbar: toolbar,
      //   height: 240
      // });

    },


    /**
     * Stop CKEditor instances on title and body.
     */
    stopCKEditor: function() {
      // _.each(CKEDITOR.instances, function(val, key) {
      //   val.destroy(true);
      // });
    },


    /**
     * Query for items.
     *
     * @param {Object} req: The search request, with `term` key.
     * @param {Function} res: Callback that takes autocomplete options.
     */
    onSearch: function(req, res) {

      // Request items.
      $.get(Neatline.global.items_api, {
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
      this.__ui.item.change();
      this.__ui.title.val(ui.item.label).change();
    }


  });


}});
