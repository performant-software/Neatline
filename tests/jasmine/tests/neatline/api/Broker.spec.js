
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('API | Broker', function() {


  var model1, model2;


  beforeEach(function() {

    NL.loadNeatline();

    model1 = new Neatline.Shared.Record.Model();
    model2 = new Neatline.Shared.Record.Model();

  });


  describe('highlight', function() {

    it('should do nothing when no record is highlighted', function() {

      // ----------------------------------------------------------------------
      // When no record is currently highlighted, the broker should do nothing
      // when a new record is highlighted.
      // ----------------------------------------------------------------------

      var vent = NL.getEventSpy();

      Neatline.vent.trigger('highlight', { model: model1, source: 'SRC1' });
      NL.assertEventNotCalled(vent, 'unhighlight');

    });

    it('should unhighlight a currently-highlighted record', function() {

      // ----------------------------------------------------------------------
      // When a record is highlighted and then another record is highlighted,
      // the broker should unhighlight the previously-highlighted record.
      // ----------------------------------------------------------------------

      var vent = NL.getEventSpy();

      Neatline.vent.trigger('highlight', { model: model1, source: 'SRC1' });
      Neatline.vent.trigger('highlight', { model: model2, source: 'SRC2' });

      expect(vent).toHaveBeenCalledWith('unhighlight', {
        model: model1, source: 'BROKER'
      });

    });

  });


  describe('unhighlight', function() {

    it('should unregister the record', function() {

      // ----------------------------------------------------------------------
      // When a record is unhighlighted by an application module, the broker
      // should unregister it and not try to re-unhighlight it the next time
      // a new record is highlighted.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('highlight', { model: model1, source: 'SRC1' });
      Neatline.vent.trigger('unhighlight', { model: model1, source: 'SRC1' });

      var vent = NL.getEventSpy();

      Neatline.vent.trigger('highlight', { model: model2, source: 'SRC2' });
      NL.assertEventNotCalled(vent, 'unhighlight');

    });

  });


  describe('select', function() {

    it('should do nothing when no record is selected', function() {

      // ----------------------------------------------------------------------
      // When no record is currently selected, the broker should do nothing
      // when a new record is selected.
      // ----------------------------------------------------------------------

      var vent = NL.getEventSpy();

      Neatline.vent.trigger('select', { model: model1, source: 'SRC1' });
      NL.assertEventNotCalled(vent, 'unselect');

    });

    it('should unselect a currently-selected record', function() {

      // ----------------------------------------------------------------------
      // When a record is selected and then another record is selected, the
      // broker should unselect the previously-selected record.
      // ----------------------------------------------------------------------

      var vent = NL.getEventSpy();

      Neatline.vent.trigger('select', { model: model1, source: 'SRC1' });
      Neatline.vent.trigger('select', { model: model2, source: 'SRC2' });

      expect(vent).toHaveBeenCalledWith('unselect', {
        model: model1, source: 'BROKER'
      });

    });

  });


  describe('unselect', function() {

    it('should unregister the record', function() {

      // ----------------------------------------------------------------------
      // When a record is unselected by an application module, the broker
      // should unregister it and not try to re-unselect it the next time a
      // new record is highlighted.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('select', { model: model1, source: 'SRC1' });
      Neatline.vent.trigger('unselect', { model: model1, source: 'SRC1' });

      var vent = NL.getEventSpy();

      Neatline.vent.trigger('select', { model: model2, source: 'SRC2' });
      NL.assertEventNotCalled(vent, 'unselect');

    });

  });


});
