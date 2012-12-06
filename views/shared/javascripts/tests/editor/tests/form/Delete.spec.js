
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

  var modal, id;

  // Start editor.
  beforeEach(function() {

    _t.loadEditor();

    // Open Record 2 form.
    var recordRows = _t.getRecordRows();
    $(recordRows[1]).trigger('click');

    // Get modal container.
    modal = $('#deleteConfirm');

    // Get Record 2 id.
    id = _t.formView.model.get('id');

  });

  it('should show modal when "Delete" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Delete" button is clicked, a modal should display that
    // prompts the user for confirmation.
    // --------------------------------------------------------------------

    // Click on "Delete".
    _t.formView.deleteButton.trigger('click');

    // Check for overlay and modal.
    expect($('body')).toContain('div.modal-backdrop.in');
    expect(modal).toHaveClass('in');

  });

  it('should close modal when "Cancel" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Cancel" button in the modal is clicked, the modal should
    // disappear and the form should return to its normal state.
    // --------------------------------------------------------------------

    // Click on "Delete", then "Cancel"
    _t.formView.deleteButton.trigger('click');
    modal.find('button[data-dismiss="modal"]').trigger('click');

    // Check for closed modal.
    expect(modal).not.toHaveClass('in');

  });

  it('should execute delete when "Delete" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Yes, delete" button in the modal is clicked, a DELETE
    // request should be issued to the records API.
    // --------------------------------------------------------------------

    // Click on "Delete", then "Yes, delete".
    _t.formView.deleteButton.trigger('click');
    _t.formView.confirmButton.trigger('click');

    // Capture outoing DELETE request.
    var request = _t.getLastRequest();

    // Check method and route.
    expect(request.method).toEqual('DELETE');
    expect(request.url).toEqual('/neatline/records/'+id);

  });

  it('should close modal when "Delete" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Yes, delete" button in the modal is clicked, the modal
    // and form should disappear when the request completes.
    // --------------------------------------------------------------------

    // Click on "Delete", then "Yes, delete".
    _t.formView.deleteButton.trigger('click');
    _t.formView.confirmButton.trigger('click');
    _t.respondLast200('');

    // Check for closed form.
    expect(modal).not.toHaveClass('in');
    expect(_t.recordsView.$el).not.toContain(_t.formView.form);
    expect(_t.recordsView.$el).toContain(_t.recordsView.ul);

  });

  it('should remove the model from the records collection', function() {

    // --------------------------------------------------------------------
    // When a record is deleted, the model for the record should be
    // removed from the records collection and the listing for the record
    // should not appear in the records list after the form closes.
    // --------------------------------------------------------------------

    // Click on "Delete", then "Yes, delete".
    _t.formView.deleteButton.trigger('click');
    _t.formView.confirmButton.trigger('click');
    _t.respondLast200('');

    // Model absent from records collection.
    expect(_t.recordsColl.get(id)).toBeUndefined();

    // Just 2 record listings.
    recordRows = _t.getRecordRows();
    expect(recordRows.length).toEqual(2);

    // Record 2 removed from list.
    expect($(recordRows[0]).find('.record-title').text()).
      toEqual('Title 1');
    expect($(recordRows[1]).find('.record-title').text()).
      toEqual('Title 3');

  });

  it('should remove the model from the map collection', function() {

    // --------------------------------------------------------------------
    // When a record is deleted, the model for the record should be
    // removed from the map records collection, the layer for the record
    // should be removed immediately from the map, and the layer should
    // be removed from the `layers` tracker array on the map view.
    // --------------------------------------------------------------------

    // Capture the form model.
    var model = _t.formView.model;

    // Click on "Delete", then "Yes, delete".
    _t.formView.deleteButton.trigger('click');
    _t.formView.confirmButton.trigger('click');
    _t.respondLast200('');

    // Model absent from records collection.
    expect(_t.mapColl.get(id)).toBeUndefined();

    // Layer removed from map.
    expect(_t.mapView.getLayerByModel(model)).toBeUndefined();

    // Layer removed from `layers` tracker.
    expect(_.find(_t.mapView.layers, function(layer) {
      return layer.nId == id; })).toBeUndefined();

  });

});
