
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


  var el;


  beforeEach(function() {

    _t.loadEditor();
    _t.openFirstRecordForm();

    el = {
      text:     _t.vw.RECORD.$('a[href="#record-text"]'),
      spatial:  _t.vw.RECORD.$('a[href="#record-spatial"]'),
      close:    _t.vw.RECORD.$('a[name="close"]')
    };

  });


  it('should deactivate when form opened with spatial tab', function() {

    // --------------------------------------------------------------------
    // When the record form is opened and the spatial tab is selected, the
    // presenter should be deactivated.
    // --------------------------------------------------------------------

    // Select "Spatial".
    el.spatial.tab('show');

    // Close the form.
    el.close.trigger('click');
    _t.respondRecords();

    // Spy on trigger.
    var vent = spyOn(Neatline.vent, 'trigger').andCallThrough();

    // Reopen the form.
    _t.openFirstRecordForm();

    // Presenter should deactivate.
    expect(vent).toHaveBeenCalledWith('PRESENTER:deactivate');

  });


  it('should deactivate when spatial tab is selected', function() {

    // --------------------------------------------------------------------
    // When a record is being edited and the spatial tab is selected, the
    // presenter should be deactivated.
    // --------------------------------------------------------------------

    // Spy on trigger.
    var vent = spyOn(Neatline.vent, 'trigger').andCallThrough();

    // Select "Spatial".
    el.spatial.tab('show');

    // Presenter should deactivate.
    expect(vent).toHaveBeenCalledWith('PRESENTER:deactivate');

  });


  it('should activate when spatial tab is unselected', function() {

    // --------------------------------------------------------------------
    // When a record is being edited and the spatial tab is unselected,
    // the presenter should be activated.
    // --------------------------------------------------------------------

    // Spy on trigger.
    var vent = spyOn(Neatline.vent, 'trigger').andCallThrough();

    // Select "Spatial".
    el.spatial.tab('show');

    // Select "Text".
    el.text.tab('show');

    // Presenter should activate.
    expect(vent).toHaveBeenCalledWith('PRESENTER:activate');

  });


  it('should unselect, activate when the form is closed', function() {

    // --------------------------------------------------------------------
    // When the record form is closed, the presenter should be unselected
    // and activated.
    // --------------------------------------------------------------------

    // Select "Spatial".
    el.spatial.tab('show');

    // Spy on trigger and execute.
    var vent = spyOn(Neatline.vent, 'trigger').andCallThrough();
    var exec = spyOn(Neatline, 'execute').andCallThrough();

    // Capture the form model.
    var model = _t.vw.RECORD.model;

    // Close the form.
    el.close.trigger('click');
    _t.respondRecords();

    // Presenter should activate.
    expect(vent).toHaveBeenCalledWith('PRESENTER:activate');
    expect(exec).toHaveBeenCalledWith('PRESENTER:unselect', model);

  });


});
