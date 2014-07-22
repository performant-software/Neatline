
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Events | Router', function() {


  var record, fixtures =  {
    record: read('NeatlineEventsRouter.record.json')
  };


  beforeEach(function() {
    NL.loadEditor();
    record = NL.recordFromJson(fixtures.record);
  });


  it('should update the route when a record is selected', function() {

    // ------------------------------------------------------------------------
    // When a record is selected, the route should be updated to point to the
    // selected record's edit form.
    // ------------------------------------------------------------------------

    Neatline.vent.trigger('select', { model: record });
    NL.assertRoute('edit/'+record.id);

  });


});
