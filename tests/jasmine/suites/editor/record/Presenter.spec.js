
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for interactions between the presenter and record form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Presenter', function() {


  var el;


  beforeEach(function() {

    _t.loadEditor();
    _t.showRecordForm(_t.json.RecordForm.record);

    el = {
      text:   _t.vw.RECORD.$('a[href="#record-text"]'),
      map:    _t.vw.RECORD.$('a[href="#record-map"]'),
      close:  _t.vw.RECORD.$('a[name="close"]')
    };

  });


  it('should deactivate when form opened with map tab', function() {

    // --------------------------------------------------------------------
    // When the record form is opened and the map tab is selected, the
    // presenter should be deactivated.
    // --------------------------------------------------------------------

    // Spy on trigger.
    var vent = spyOn(Neatline.vent, 'trigger').andCallThrough();

    // Request record map tab.
    _t.navigate('record/add/map');

    // Presenter should deactivate.
    expect(vent).toHaveBeenCalledWith('PRESENTER:deactivate');

  });


  it('should deactivate when map tab is selected', function() {

    // --------------------------------------------------------------------
    // When a record is being edited and the map tab is selected, the
    // presenter should be deactivated.
    // --------------------------------------------------------------------

    // Spy on trigger.
    var vent = spyOn(Neatline.vent, 'trigger').andCallThrough();

    // Select "Map".
    el.map.tab('show');

    // Presenter should deactivate.
    expect(vent).toHaveBeenCalledWith('PRESENTER:deactivate');

  });


  it('should activate when map tab is unselected', function() {

    // --------------------------------------------------------------------
    // When a record is being edited and the map tab is unselected, the
    // presenter should be activated.
    // --------------------------------------------------------------------

    // Spy on trigger.
    var vent = spyOn(Neatline.vent, 'trigger').andCallThrough();

    // Select "Map".
    el.map.tab('show');

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

    // Select "Map".
    el.map.tab('show');

    // Spy on trigger and execute.
    var vent = spyOn(Neatline.vent, 'trigger').andCallThrough();
    var exec = spyOn(Neatline, 'execute').andCallThrough();

    // Capture the form model.
    var model = _t.vw.RECORD.model;

    // Close the form.
    el.close.trigger('click');

    // Presenter should activate.
    expect(vent).toHaveBeenCalledWith('PRESENTER:activate');
    expect(exec).toHaveBeenCalledWith('PRESENTER:unselect', model);

  });


});
