
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('API | Events', function() {


  var model1, model2, model3;


  beforeEach(function() {

    NL.loadNeatline();

    model1 = new Neatline.Shared.Record.Model({ id: 1 });
    model2 = new Neatline.Shared.Record.Model({ id: 2 });
    model3 = new Neatline.Shared.Record.Model({ id: 3 });
    model4 = new Neatline.Shared.Record.Model({ id: 4 });

  });


  describe('highlight', function() {

    it('should do nothing when no records are highlighted', function() {

      // ----------------------------------------------------------------------
      // When no records area currently highlighted, the broker should do
      // nothing when a new record is highlighted.
      // ----------------------------------------------------------------------

      var vent = NL.getEventSpy();

      Neatline.vent.trigger('highlight', {
        model: model1, source: 'SRC1'
      });

      NL.assertEventNotCalled(vent, 'unhighlight');

    });

    it('should unhighlight currently-highlighted record', function() {

      // ----------------------------------------------------------------------
      // When a record is highlighted and then another record is highlighted,
      // the broker should unhighlight the previously-highlighted record.
      // ----------------------------------------------------------------------

      var vent = NL.getEventSpy();

      Neatline.vent.trigger('highlight', {
        model: model1, source: 'SRC1'
      });
      Neatline.vent.trigger('highlight', {
        model: model2, source: 'SRC2'
      });

      expect(vent).toHaveBeenCalledWith('unhighlight', {
        model: model1, source: 'EVENTS'
      });

    });

    it('should not unhighlight when `allowMultiple` is passed', function() {

      // ----------------------------------------------------------------------
      // When `allowMultiple` set to true, the currently highlighted record(s)
      // should _not_ be unhighlighted.
      // ----------------------------------------------------------------------

      var vent = NL.getEventSpy();

      Neatline.vent.trigger('highlight', {
        model: model1, allowMultiple: true, source: 'SRC1'
      });
      Neatline.vent.trigger('highlight', {
        model: model2, allowMultiple: true, source: 'SRC2'
      });
      Neatline.vent.trigger('highlight', {
        model: model3, allowMultiple: true, source: 'SRC3'
      });

      NL.assertEventNotCalled(vent, 'unhighlight');

    });

    it('should unhighlight all records after `allowMultiple`', function() {

      // ----------------------------------------------------------------------
      // When multiple records are simultaneously highlighted as a result of
      // multiple `highlight` events with `allowMultiple` set to true, a new
      // `highlight` event _without_ `allowMultiple` should cause all of the
      // previously-highlighted records to be unhighlighted.
      // ----------------------------------------------------------------------

      var vent = NL.getEventSpy();

      // Multiple highlight models 1-3.
      Neatline.vent.trigger('highlight', {
        model: model1, allowMultiple: true, source: 'SRC1'
      });
      Neatline.vent.trigger('highlight', {
        model: model2, allowMultiple: true, source: 'SRC2'
      });
      Neatline.vent.trigger('highlight', {
        model: model3, allowMultiple: true, source: 'SRC3'
      });

      // Exclusive highlight model 4.
      Neatline.vent.trigger('highlight', {
        model: model4, source: 'SRC4'
      });

      // Should unhighlight models 1-3.
      expect(vent).toHaveBeenCalledWith('unhighlight', {
        model: model1, source: 'EVENTS'
      });
      expect(vent).toHaveBeenCalledWith('unhighlight', {
        model: model2, source: 'EVENTS'
      });
      expect(vent).toHaveBeenCalledWith('unhighlight', {
        model: model3, source: 'EVENTS'
      });

    });

  });


  describe('unhighlight', function() {

    it('should de-register the record in the highlight list', function() {

      // ----------------------------------------------------------------------
      // When a record is unhighlighted by an application module, the broker
      // should unregister it and not try to re-unhighlight it the next time
      // a new record is highlighted.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('highlight', {
        model: model1, source: 'SRC1'
      });
      Neatline.vent.trigger('unhighlight', {
        model: model1, source: 'SRC1'
      });

      var vent = NL.getEventSpy();

      Neatline.vent.trigger('highlight', {
        model: model2, source: 'SRC2'
      });

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

    it('should unselect the currently-selected record', function() {

      // ----------------------------------------------------------------------
      // When a record is selected and then another record is selected, the
      // broker should unselect the previously-selected records.
      // ----------------------------------------------------------------------

      var vent = NL.getEventSpy();

      Neatline.vent.trigger('select', {
        model: model1, source: 'SRC1'
      });
      Neatline.vent.trigger('select', {
        model: model2, source: 'SRC2'
      });

      expect(vent).toHaveBeenCalledWith('unselect', {
        model: model1, source: 'EVENTS'
      });

    });

    it('should not unselect when `allowMultiple` is passed', function() {

      // ----------------------------------------------------------------------
      // When `allowMultiple` set to true, the currently selected record(s)
      // should _not_ be unhighlighted.
      // ----------------------------------------------------------------------

      var vent = NL.getEventSpy();

      Neatline.vent.trigger('select', {
        model: model1, allowMultiple: true, source: 'SRC1'
      });
      Neatline.vent.trigger('select', {
        model: model2, allowMultiple: true, source: 'SRC2'
      });
      Neatline.vent.trigger('select', {
        model: model3, allowMultiple: true, source: 'SRC3'
      });

      NL.assertEventNotCalled(vent, 'unselect');

    });

    it('should unselect all records after `allowMultiple`', function() {

      // ----------------------------------------------------------------------
      // When multiple records are simultaneously selected as a result of
      // multiple `select` events with `allowMultiple` set to true, a new
      // `select` event _without_ `allowMultiple` should cause all of the
      // previously-highlighted records to be unselected.
      // ----------------------------------------------------------------------

      var vent = NL.getEventSpy();

      // Multiple select models 1-3.
      Neatline.vent.trigger('select', {
        model: model1, allowMultiple: true, source: 'SRC1'
      });
      Neatline.vent.trigger('select', {
        model: model2, allowMultiple: true, source: 'SRC2'
      });
      Neatline.vent.trigger('select', {
        model: model3, allowMultiple: true, source: 'SRC3'
      });

      // Exclusive select model 4.
      Neatline.vent.trigger('select', {
        model: model4, source: 'SRC4'
      });

      // Should unselect models 1-3.
      expect(vent).toHaveBeenCalledWith('unselect', {
        model: model1, source: 'EVENTS'
      });
      expect(vent).toHaveBeenCalledWith('unselect', {
        model: model2, source: 'EVENTS'
      });
      expect(vent).toHaveBeenCalledWith('unselect', {
        model: model3, source: 'EVENTS'
      });

    });

  });


  describe('unselect', function() {

    it('should de-register the record in the select list', function() {

      // ----------------------------------------------------------------------
      // When a record is unselected by an application module, the broker
      // should unregister it and not try to re-unselect it the next time a
      // new record is highlighted.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('select', {
        model: model1, source: 'SRC1'
      });
      Neatline.vent.trigger('unselect', {
        model: model1, source: 'SRC1'
      });

      var vent = NL.getEventSpy();

      Neatline.vent.trigger('select', {
        model: model2, source: 'SRC2'
      });

      NL.assertEventNotCalled(vent, 'unselect');

    });

  });


});
