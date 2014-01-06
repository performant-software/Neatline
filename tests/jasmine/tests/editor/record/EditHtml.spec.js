
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Edit HTML', function() {


  // --------------------------------------------------------------------------
  // When the "Edit HTML" link next to the "Title" or "Body" textareas is
  // clicked, CKEditor should be displayed with the field content. When the
  // editor is minimized, the new value from CKEditor should be set in the
  // textarea and the form model should be updated.
  // --------------------------------------------------------------------------


  var async = new AsyncSpec(this);


  var elements, cke, input, fixtures = {
    record: read('EditorRecord.record.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showRecordForm(fixtures.record);

    elements = {
      title:      NL.v.textTab.$('textarea[name="title"]'),
      body:       NL.v.textTab.$('textarea[name="body"]'),
      editTitle:  NL.v.textTab.$('a[data-textarea="title"]'),
      editBody:   NL.v.textTab.$('a[data-textarea="body"]')
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
      var value = NL.v.record.model.get(cke.name).trim();
      expect(value).toEqual('<p>2</p>');

      // Should update the textarea.
      expect(input.val().trim()).toEqual('<p>2</p>');
      done();

    });

  });


  it('title', function() {

    input = elements.title;
    input.val('<p>1</p>');

    elements.editTitle.click();
    cke = CKEDITOR.instances.title;

  });


  it('body', function() {

    input = elements.body;
    input.val('<p>1</p>');

    elements.editBody.click();
    cke = CKEDITOR.instances.body;

  });


});
