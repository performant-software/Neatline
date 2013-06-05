
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form | Text Editors', function() {


  // ----------------------------------------------------------------------
  // When the "Edit HTML" link next to the "Title" or "Body" textareas is
  // clicked, CKEditor should be displayed with the field content. When
  // the editor is minimized, the new value from CKEditor should be set in
  // the textarea and the form model should be updated.
  // ----------------------------------------------------------------------


  var async = new AsyncSpec(this);


  var el, cke, input, fx = {
    record: read('EditorRecord.record.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showRecordForm(fx.record);

    el = {
      editTitleHtml:  NL.vw.TEXT.$('a[data-textarea="title"]'),
      editBodyHtml:   NL.vw.TEXT.$('a[data-textarea="body"]')
    };

  });


  async.afterEach(function(done) {

    // When editor is started.
    // -----------------------
    cke.on('instanceReady', function() {

      // Should apply starting content.
      expect(cke.getData().trim()).toEqual('<p>1</p>');

      // Set new data, minimize.
      cke.setData('<p>2</p>', function() {
        cke.execCommand('maximize');
      });

    });

    // When editor is destroyed.
    // -------------------------
    input.change(function() {

      // Should update the model.
      var value = NL.vw.RECORD.model.get(cke.name).trim();
      expect(value).toEqual('<p>2</p>');

      // Should update the textarea.
      expect(input.val().trim()).toEqual('<p>2</p>');
      done();

    });

  });


  it('title', function() {

    input = NL.vw.TEXT.__ui.title;
    input.val('<p>1</p>');

    el.editTitleHtml.click();
    cke = CKEDITOR.instances.title;

  });


  it('body', function() {

    input = NL.vw.TEXT.__ui.body;
    input.val('<p>1</p>');

    el.editBodyHtml.click();
    cke = CKEDITOR.instances.body;

  });


});
