
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Broker', function() {


  var model1, model2, vent;


  beforeEach(function() {

    NL.loadNeatline();

    model1 = new Neatline.Shared.Record.Model();
    model2 = new Neatline.Shared.Record.Model();

    vent = NL.getEventSpy();

  });


  describe('highlight', function() {

    it('should do nothing when no record is highlighted', function() {

      // ----------------------------------------------------------------------
      // When no record is currently highlighted, the broker should do nothing
      // when a new record is highlighted.
      // ----------------------------------------------------------------------

      // TODO

    });

    it('should unhighlight a currently-highlighted record', function() {

      // ----------------------------------------------------------------------
      // When a record is highlighted and then another record is highlighted,
      // the broker should unhighlight the previously-highlighted record.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('highlight', { model: model1, source: 'SRC1' });
      Neatline.vent.trigger('highlight', { model: model2, source: 'SRC2' });

      expect(vent).toHaveBeenCalledWith('unhighlight', {
        model: model1, source: 'BROKER'
      });

    });

  });


  describe('unhighlight', function() {
    it('should unregister the record');
  });


  describe('select', function() {

    it('should do nothing when no record is selected', function() {

      // ----------------------------------------------------------------------
      // When no record is currently selected, the broker should do nothing
      // when a new record is selected.
      // ----------------------------------------------------------------------

      // TODO

    });

    it('should unselect a currently-selected record', function() {

      // ----------------------------------------------------------------------
      // When a record is selected and then another record is selected, the
      // broker should unselect the previously-selected record.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('select', { model: model1, source: 'SRC1' });
      Neatline.vent.trigger('select', { model: model2, source: 'SRC2' });

      expect(vent).toHaveBeenCalledWith('unselect', {
        model: model1, source: 'BROKER'
      });

    });

  });


  describe('unselect', function() {
    it('should unregister the record');
  });


});
