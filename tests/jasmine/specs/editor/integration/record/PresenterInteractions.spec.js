
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form | Presenter Interactions', function() {


  var el, fx = {
    record: read('EditorRecord.record.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showRecordForm(fx.record);

    el = {
      text:   NL.vw.RECORD.$('a[href="#record-text"]'),
      map:    NL.vw.RECORD.$('a[href="#record-map"]'),
      close:  NL.vw.RECORD.$('a[name="close"]')
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
    NL.navigate('record/add/map');

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


  it('should activate when the form is closed', function() {

    // --------------------------------------------------------------------
    // When the record form is closed, the presenter should be activated.
    // --------------------------------------------------------------------

    // Select "Map".
    el.map.tab('show');

    // Spy on trigger and execute.
    var vent = spyOn(Neatline.vent, 'trigger').andCallThrough();
    var exec = spyOn(Neatline, 'execute').andCallThrough();

    // Capture the form model.
    var model = NL.vw.RECORD.model;

    // Close the form.
    el.close.trigger('click');

    // Presenter should activate.
    expect(vent).toHaveBeenCalledWith('PRESENTER:activate');

  });


});
