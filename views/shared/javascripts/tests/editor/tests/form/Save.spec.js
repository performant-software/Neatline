
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for form delete.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Form Save', function() {

  // Start editor.
  beforeEach(function() {

    _t.loadEditor();

    // Open Record 2 form.
    var recordRows = _t.getRecordRows();
    $(recordRows[1]).trigger('click');

  });

  it('should change button text while request is running', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked, the button text should change to
    // "Saving" while the request is running.
    // --------------------------------------------------------------------

    // Click on "Save".
    _t.formView.saveButton.trigger('click');

    // Check for changed button text.
    expect(_t.formView.saveButton).toHaveText('Saving');

    // Complete request.
    _t.respondLast200('');

    // Check for restored button text.
    expect(_t.formView.saveButton).toHaveText('Save');

  });

  it('should flash a notification when the save succeeds', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked, `noty` should be called when the
    // request completes with the correct message string.
    // --------------------------------------------------------------------

    // Spy on noty.
    noty = jasmine.createSpy();

    // Click on "Save".
    _t.formView.saveButton.trigger('click');
    _t.respondLast200('');

    // Check for `noty` call.
    expect(noty).toHaveBeenCalled();
    expect(noty.argsForCall[0][0].text).toEqual(
      _t.formView.options.messages.save
    );

  });

});
