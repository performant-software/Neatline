
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
    NL.loadNeatline();
    record = NL.recordFromJson(fixtures.record);
  });


  it('should select the record referenced in the route', function(done) {

    // ------------------------------------------------------------------------
    // When a `#record/<id>` route is matched, the record with the requested
    // ID should be selected.
    // ------------------------------------------------------------------------

    var vent = NL.getEventSpy();

    // Listen for record select.
    Neatline.vent.on('select', function(args) {
      expect(args.model.id).toEqual(record.id);
      done();
    });

    // Hit the route.
    NL.navigate('records/'+record.id);

    // Respond with the JSON.
    NL.respondLast200(fixtures.record);

  });


  it('should update the route when a record is selected', function() {

    // ------------------------------------------------------------------------
    // When a record is selected, the route should be updated to point to the
    // selected record.
    // ------------------------------------------------------------------------

    Neatline.vent.trigger('select', { model: record });
    NL.assertRoute('records/'+record.id);

  });


});
