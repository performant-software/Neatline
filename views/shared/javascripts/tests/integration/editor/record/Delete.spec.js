
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


  var els, id;


  beforeEach(function() {

    _t.loadEditor();
    _t.openRecordForm();

    id = _t.vw.record.model.get('id');

    els = {
      delete1:  _t.vw.record.$('a[name="delete1"]'),
      delete2:  _t.vw.record.$('a[name="delete2"]'),
      cancel:   _t.vw.record.$('a[name="cancel"]'),
      modal:    _t.vw.record.$('div.modal')
    };

  });


  it('should show modal when "Delete" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Delete" button is clicked, the confirmation modal should
    // be displayed.
    // --------------------------------------------------------------------

    // Click on "Delete".
    els.delete1.trigger('click');

    // Modal and overlay should be visible.
    expect($('body')).toContain('div.modal-backdrop.in');
    expect(els.modal).toHaveClass('in');

  });


  it('should close modal when "Cancel" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Cancel" button is clicked, the modal should disappear and
    // the form should return to its normal state.
    // --------------------------------------------------------------------

    // Click on "Delete".
    els.delete1.trigger('click');

    // Click on "Cancel".
    els.cancel.trigger('click');

    // Modal should be closed.
    expect(els.modal).not.toHaveClass('in');

  });


  it('should execute delete when "Delete" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Yes, delete" button is clicked, a well-formed DELETE
    // request should be issued to the records API.
    // --------------------------------------------------------------------

    // Delete, confirm.
    els.delete1.trigger('click');
    els.delete2.trigger('click');

    // Capture outoing request.
    var request = _t.getLastRequest();

    // Method should be DELETE.
    expect(request.method).toEqual('DELETE');

    // URL should be /record/:id.
    expect(request.url).toEqual(__exhibit.api.record+'/'+id);

  });


  it('should flash notification when the delete succeeds', function() {

    // --------------------------------------------------------------------
    // When the "Yes, Delete" button is clicked and the request succeeds,
    // a success notification should be displayed.
    // --------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'info');

    // Click on "Save".
    els.delete2.trigger('click');
    _t.respondLast200('');

    // `toastr` should be called.
    expect(toastr.info).toHaveBeenCalledWith(
      STRINGS.record.delete.success, null, _t.vw.editor.options.toastr
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
    els.delete2.trigger('click');
    _t.respondLast500();

    // `toastr` should be called.
    expect(toastr.error).toHaveBeenCalledWith(
      STRINGS.record.delete.error, null, _t.vw.editor.options.toastr
    );

  });


  it('should close modal when "Delete" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Yes, delete" button is clicked and the request succeeds,
    // the modal should disappear, the form should close, and the records
    // list should be displayed.
    // --------------------------------------------------------------------

    // Delete, confirm.
    els.delete1.trigger('click');
    els.delete2.trigger('click');
    _t.respondLast200('');

    // Modal should be hidden.
    expect(els.modal).not.toHaveClass('in');

    // Form should be closed.
    expect(_t.el.editor).not.toContain(_t.el.record);
    expect(_t.el.editor).toContain(_t.el.records);

    // Records list should be displayed.
    expect(Backbone.history.fragment).toEqual('records');

  });


  it('should remove the model from the map collection', function() {

    // --------------------------------------------------------------------
    // When a record is deleted, the model for the record should be
    // removed from the map records collection, the layer for the record
    // should be removed immediately from the map, and the layer should
    // be removed from the `layers` tracker array on the map view.
    // --------------------------------------------------------------------

    // Capture the form model.
    var model = _t.vw.record.model;

    // Delete, confirm.
    els.delete1.trigger('click');
    els.delete2.trigger('click');
    _t.respondLast200('');

    // Layer should be removed from map.
    expect(_t.vw.map.getLayer(model)).toBeUndefined();

    // Layer should be removed from `layers`.
    expect(_.find(_t.vw.map.layers, function(layer) {
      return layer.nId == id; })).toBeUndefined();

  });


});
