
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for form delete.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Form Delete', function() {

  // Start editor.
  beforeEach(function() {

    _t.loadEditor();

    // Open Record 2 form.
    var recordRows = _t.getRecordRows();
    $(recordRows[0]).trigger('click');

  });

  it('should show modal when "Delete" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Delete" button is clicked, a modal should display that
    // prompts the user for confirmation.
    // --------------------------------------------------------------------

    // Click on "Delete".
    _t.formView.delButton.modal('show');

    // Check for overlay and modal.
    expect($('body')).toContain('div.modal-backdrop.in');

  });

  it('should close modal when "Cancel" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Cancel" button in the modal is clicked, the modal should
    // disappear and the form should return to its normal state.
    // --------------------------------------------------------------------

  });

  it('should execute delete when "Delete" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Yes, delete" button in the modal is clicked, a DELETE
    // request should be issued to the records API.
    // --------------------------------------------------------------------

  });

  it('should close modal when "Delete" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Yes, delete" button in the modal is clicked, the modal
    // should disappear when the request completes.
    // --------------------------------------------------------------------

  });

  it('should remove the model from the records collection', function() {

    // --------------------------------------------------------------------
    // When a record is deleted, the model for the record should be
    // removed from the records collection and the listing for the record
    // should not appear in the records list after the form closes.
    // --------------------------------------------------------------------

  });

  it('should remove the model from the map collection', function() {

    // --------------------------------------------------------------------
    // When a record is deleted, the model for the record should be
    // removed from the map records collection, the layer for the record
    // should be removed immediately from the map, and the layer should
    // be removed from the `layers` tracker array on the map view.
    // --------------------------------------------------------------------

  });

  describe('Regression', function() {

    it('should not try to remove a non-existent map layer', function() {

      // ------------------------------------------------------------------
      // When a record is deleted that does not have a corresponding layer
      // on the map, `removeLayer` should not be called with a null value.
      // ------------------------------------------------------------------

    });

  });

});
