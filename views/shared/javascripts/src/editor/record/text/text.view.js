
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Text', {
  startWithParent: false,
  define: function(Text) {


    Text.View = Neatline.Shared.View.extend({


      events: {

        // Show CKEditors on "Edit HTML" click.
        'click a[data-textarea]': 'onEditHtmlClick'

      },


      /**
       * Display a fullscreen CKEditor for a textarea.
       *
       * @param {Object} e: The click event.
       */
      onEditHtmlClick: function(e) {

        // Allow all HTML tags.
        CKEDITOR.config.allowedContent = true;

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


  }
});
