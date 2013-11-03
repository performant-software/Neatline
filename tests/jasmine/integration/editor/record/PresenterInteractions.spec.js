
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Presenter Interactions', function() {


  var elements, fixtures = {
    record: read('EditorRecord.record.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showRecordForm(fixtures.record);

    elements = {
      text:   NL.v.record.$('a[href="#record-text"]'),
      map:    NL.v.record.$('a[href="#record-map"]'),
      close:  NL.v.record.$('a[name="close"]')
    };

  });


  it('should deactivate when map tab is selected', function() {

    // ------------------------------------------------------------------------
    // When the map tab is selected, the presenter should be deactivated.
    // ------------------------------------------------------------------------

    // Spy on trigger.
    var vent = NL.getEventSpy();

    // Select "Map".
    elements.map.tab('show');

    // Presenter should deactivate.
    expect(vent).toHaveBeenCalledWith('deactivatePresenter');

  });


  it('should activate when map tab is unselected', function() {

    // ------------------------------------------------------------------------
    // When the map tab is unselected, the presenter should be activated.
    // ------------------------------------------------------------------------

    // Spy on trigger.
    var vent = NL.getEventSpy();

    // Select "Map".
    elements.map.tab('show');

    // Select "Text".
    elements.text.tab('show');

    // Presenter should activate.
    expect(vent).toHaveBeenCalledWith('activatePresenter');

  });


  it('should deactivate when form opened with map tab', function() {

    // ------------------------------------------------------------------------
    // When the record form is opened with the map tab selected, the presenter
    // should be deactivated.
    // ------------------------------------------------------------------------

    // Spy on trigger.
    var vent = NL.getEventSpy();

    // Request record map tab.
    NL.navigate('record/add/map');

    // Presenter should deactivate.
    expect(vent).toHaveBeenCalledWith('deactivatePresenter');

  });


  it('should activate when the form is closed', function() {

    // ------------------------------------------------------------------------
    // When the record form is closed, the presenter should be activated.
    // ------------------------------------------------------------------------

    // Select "Map".
    elements.map.tab('show');

    // Spy on trigger and execute.
    var vent = NL.getEventSpy();
    var exec = NL.getCommandSpy();

    // Capture the form model.
    var model = NL.v.record.model;

    // Close the form.
    elements.close.trigger('click');

    // Presenter should activate.
    expect(vent).toHaveBeenCalledWith('activatePresenter');

  });


});
