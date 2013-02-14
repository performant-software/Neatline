
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for interactions between the presenter and record form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Presenter Form Interaction', function() {


  var els;


  beforeEach(function() {

    _t.loadEditor();
    _t.openRecordForm();

    els = {
      text:     _t.vw.record.$('a[href="#record-form-text"]'),
      spatial:  _t.vw.record.$('a[href="#record-form-spatial"]'),
      close:    _t.vw.record.$('a[name="close"]')
    };

  });


  it('should deactivate when form opened with spatial tab', function() {

    // --------------------------------------------------------------------
    // When the record form is opened and the spatial tab is selected, the
    // presenter should be deactivated.
    // --------------------------------------------------------------------

    // Select "Spatial".
    els.spatial.tab('show');

    // Close the form.
    els.close.trigger('click');
    _t.respondRecords();

    // Spy on execute.
    var exec = spyOn(Neatline, 'execute').andCallThrough();

    // Reopen the form.
    _t.openRecordForm();

    // Presenter should deactivate.
    expect(exec).toHaveBeenCalledWith('presenter:deactivate');

  });


  it('should deactivate when spatial tab is selected', function() {

    // --------------------------------------------------------------------
    // When a record is being edited and the spatial tab is selected, the
    // presenter should be deactivated.
    // --------------------------------------------------------------------

    // Spy on execute.
    var exec = spyOn(Neatline, 'execute').andCallThrough();

    // Select "Spatial".
    els.spatial.tab('show');

    // Presenter should deactivate.
    expect(exec).toHaveBeenCalledWith('presenter:deactivate');

  });


  it('should activate when spatial tab is unselected', function() {

    // --------------------------------------------------------------------
    // When a record is being edited and the spatial tab is unselected,
    // the presenter should be activated.
    // --------------------------------------------------------------------

    // Spy on execute.
    var exec = spyOn(Neatline, 'execute').andCallThrough();

    // Select "Spatial".
    els.spatial.tab('show');

    // Select "Text".
    els.text.tab('show');

    // Presenter should activate.
    expect(exec).toHaveBeenCalledWith('presenter:activate');

  });


  it('should unselect, activate when the form is closed', function() {

    // --------------------------------------------------------------------
    // When the record form is closed, the presenter should be unselected
    // and activated.
    // --------------------------------------------------------------------

    // Select "Spatial".
    els.spatial.tab('show');

    // Spy on execute.
    var exec = spyOn(Neatline, 'execute').andCallThrough();

    // Capture the form model.
    var model = _t.vw.record.model;

    // Close the form.
    els.close.trigger('click');
    _t.respondRecords();

    // Presenter should activate.
    expect(exec).toHaveBeenCalledWith('presenter:activate');
    expect(exec).toHaveBeenCalledWith('presenter:unselect', model);

  });


});
