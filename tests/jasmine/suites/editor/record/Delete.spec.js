
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record delete.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Delete', function() {


  var el;


  beforeEach(function() {

    _t.loadEditor();
    _t.showRecordForm(_t.json.RecordForm.record);

    el = {
      delete1:  _t.vw.RECORD.$('a[href="#delete-modal"]'),
      delete2:  _t.vw.RECORD.$('a[name="delete"]'),
      cancel:   _t.vw.RECORD.$('a[name="cancel"]'),
      modal:    _t.vw.RECORD.$('#delete-modal')
    };

  });


  it('should show modal when "Delete" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Delete" button is clicked, the confirmation modal should
    // be displayed.
    // --------------------------------------------------------------------

    // Click on "Delete".
    el.delete1.trigger('click');

    // Modal and overlay should be visible.
    expect($('body')).toContain('div.modal-backdrop.in');
    expect(el.modal).toHaveClass('in');

  });


  it('should close modal when "Cancel" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Cancel" button is clicked, the modal should disappear and
    // the form should return to its normal state.
    // --------------------------------------------------------------------

    // Click on "Delete".
    el.delete1.trigger('click');

    // Click on "Cancel".
    el.cancel.trigger('click');

    // Modal should be closed.
    expect(el.modal).not.toHaveClass('in');

  });


  it('should issue DELETE request when "Delete" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Yes, delete" button is clicked, a well-formed DELETE
    // request should be issued to the records API.
    // --------------------------------------------------------------------

    var id = _t.vw.RECORD.model.id;

    // Delete, confirm.
    el.delete1.trigger('click');
    el.delete2.trigger('click');

    // Route should be /record/:id, method DELETE.
    _t.assertLastRequestRoute(Neatline.global.records_api+'/'+id);
    _t.assertLastRequestMethod('DELETE');

  });


  it('should flash notification when the delete succeeds', function() {

    // --------------------------------------------------------------------
    // When the "Yes, Delete" button is clicked and the request succeeds,
    // a success notification should be displayed.
    // --------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'info');

    // Click on "Save".
    el.delete2.trigger('click');
    _t.respondLast200('');

    // Should flash success.
    expect(toastr.info).toHaveBeenCalledWith(
      STRINGS.record.remove.success
    );

  });


  it('should flash notification when the delete fails', function() {

    // --------------------------------------------------------------------
    // When the "Yes, Delete" button is clicked and the request fails, a
    // failure notification should be displayed.
    // --------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'error');

    // Click on "Save".
    el.delete2.trigger('click');
    _t.respondLast500();

    // Should flash error.
    expect(toastr.error).toHaveBeenCalledWith(
      STRINGS.record.remove.error
    );

  });


  it('should close modal and form when delete succeeds', function() {

    // --------------------------------------------------------------------
    // When the "Yes, delete" button is clicked and the request succeeds,
    // the modal should disappear, the form should close, and the records
    // list should be displayed.
    // --------------------------------------------------------------------

    // Delete, confirm.
    el.delete1.trigger('click');
    el.delete2.trigger('click');
    _t.respondLast200('');

    // Modal should be hidden.
    expect(el.modal).not.toHaveClass('in');

    // Form should be closed.
    expect(_t.vw.EDITOR.__ui.editor).not.toContain(_t.vw.RECORD.$el);
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORDS.$el);

    // Records list should be displayed.
    expect(Backbone.history.fragment).toEqual('records');

  });


  it('should refresh the exhibit when delete succeeds', function() {

    // --------------------------------------------------------------------
    // When the "Yes, delete" button is clicked and the request succeeds,
    // the map should be automatically refreshed to manifest the deletion.
    // --------------------------------------------------------------------

    spyOn(Neatline.vent, 'trigger').andCallThrough();

    // Delete, confirm.
    el.delete1.trigger('click');
    el.delete2.trigger('click');
    _t.respondLast200('');

    // Should refresh the exhibit.
    expect(Neatline.vent.trigger).toHaveBeenCalledWith('refresh');

  });


});
