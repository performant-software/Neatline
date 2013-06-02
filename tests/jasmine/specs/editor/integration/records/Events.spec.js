
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records Events', function() {


  var model, row, vent, fx = {
    records: read('EditorRecordsEvents.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.respondRecordList200(fx.records);

    // Get model and row from list.
    model = NL.getRecordListModels()[0];
    row = NL.getRecordListRows()[1];

    // Spy on the event aggregator.
    vent = spyOn(Neatline.vent, 'trigger');

  });


  it('should publish `highlight` on row mouseenter', function() {

    // --------------------------------------------------------------------
    // When the cursor hovers on a record listing, the `highlight` event
    // should be published with the feature's model.
    // --------------------------------------------------------------------

    $(row).trigger('mouseenter');

    expect(vent).toHaveBeenCalledWith('highlight', {
      model:  model,
      source: 'EDITOR:EXHIBIT:RECORDS'
    });

  });


  it('should publish `unhighlight` on row mouseleave', function() {

    // --------------------------------------------------------------------
    // When the cursor leaves a record listing, the `unhighlight` event
    // should be published with the feature's model.
    // --------------------------------------------------------------------

    $(row).trigger('mouseenter');
    $(row).trigger('mouseleave');

    expect(vent).toHaveBeenCalledWith('unhighlight', {
      model:  model,
      source: 'EDITOR:EXHIBIT:RECORDS'
    });

  });


  it('should publish `select` on row click', function() {

    // --------------------------------------------------------------------
    // When a record listing is clicked, the `unhighlight` event should be
    // published with the feature's model.
    // --------------------------------------------------------------------

    $(row).trigger('click');

    expect(vent).toHaveBeenCalledWith('select', {
      model:  model,
      source: 'EDITOR:EXHIBIT:RECORDS'
    });

  });


});
