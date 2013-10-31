
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Presenters | Static Bubble', function() {


  var model1, model2;


  beforeEach(function() {

    NL.loadNeatline();

    model1 = new Neatline.Shared.Record.Model({
      presenter: 'StaticBubble', title: 'title1', body: 'body1'
    });

    model2 = new Neatline.Shared.Record.Model({
      presenter: 'StaticBubble', title: 'title2', body: 'body2'
    });

  });


  it('should hide the bubble by default', function() {

    // ------------------------------------------------------------------------
    // By default, when the bubble is not displayed, the container should be
    // appended to the map container and invisible.
    // ------------------------------------------------------------------------

    expect(NL.vw.MAP.$el).toContain(NL.vw.BUBBLE.$el);
    expect(NL.vw.BUBBLE.$el).not.toBeVisible();

  });

  describe('highlight', function() {

    it('should show the title, but not the body or close "X"', function() {

      // ----------------------------------------------------------------------
      // When a record is highlighted, the the record should be bound to the
      // bubble and the title should be displayed in the map container.  The
      // body and close "X" should stay hidden.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('highlight', { model: model1 });

      // Title and body should be populated.
      expect(NL.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(NL.vw.BUBBLE.$('.body')).toHaveText('body1');

      // Title should be visible.
      expect(NL.vw.BUBBLE.$('.title')).toBeVisible();

      // Close "X' and body should be hidden.
      expect(NL.vw.BUBBLE.$('.close')).not.toBeVisible();
      expect(NL.vw.BUBBLE.$('.body')).not.toBeVisible();

    });

    it('should not override a selected record', function() {

      // ----------------------------------------------------------------------
      // When a record is selected and another reocrd is highlighted, the new
      // highlighted record should not be rendered in the bubble.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('select', { model: model1 });
      Neatline.vent.trigger('highlight', { model: model2 });

      // Title and body should not change.
      expect(NL.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(NL.vw.BUBBLE.$('.body')).toHaveText('body1');

    });

  });

  describe('unhighlight', function() {

    it('should hide the bubble if it is not selected', function() {

      // ----------------------------------------------------------------------
      // When a highlighted (and not selected) record is unhighlighted, the
      // bubble should be hidden.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('highlight', { model: model1 });
      Neatline.vent.trigger('unhighlight', { model: model1 });

      // Bubble should be hidden.
      expect(NL.vw.BUBBLE.$el).not.toBeVisible();

    });

    it('should not hide the bubble if it is selected', function() {

      // ----------------------------------------------------------------------
      // If the record has been selected, the bubble should not be hidden when
      // `unhighlight` is called with the same record.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('select', { model: model1 });
      Neatline.vent.trigger('unhighlight', { model: model1 });

      // Bubble should not be hidden.
      expect(NL.vw.BUBBLE.$el).toBeVisible();

    });

    it('should hide the bubble when cursor leaves the map', function() {

      // ----------------------------------------------------------------------
      // When the cursor leaves the map, the bubble should be hidden.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('highlight', { model: model1 });
      NL.triggerMapMouseout();

      // Bubble should be hidden.
      expect(NL.vw.BUBBLE.$el).not.toBeVisible();

    });

  });

  describe('select', function() {

    it('should show close "X" and body if body is non-null', function() {

      // ----------------------------------------------------------------------
      // When a record is selected and the record body content is non-null,
      // the body and close "X" should be displayed.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('select', { model: model1 });

      // Body and close "X" should be visible.
      expect(NL.vw.BUBBLE.$('.body')).toBeVisible();
      expect(NL.vw.BUBBLE.$('.close')).toBeVisible();

    });

    it('should show close "X" but not body if body is null', function() {

      // ----------------------------------------------------------------------
      // When a record is selected and the record body content is null, the
      // close "X" should be displayed but the body should stay hidden.
      // ----------------------------------------------------------------------

      model1.set('body', null);
      Neatline.vent.trigger('select', { model: model1 });

      // Close "X" should be visible.
      expect(NL.vw.BUBBLE.$('.close')).toBeVisible();

      // Body should not be visible.
      expect(NL.vw.BUBBLE.$('.body')).not.toBeVisible();

    });

    it('should override a selected record', function() {

      // ----------------------------------------------------------------------
      // When a record is selected, it should be rendered in the bubble even
      // if another record is currently selected.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('select', { model: model1 });
      Neatline.vent.trigger('select', { model: model2 });

      // Title and body should change.
      expect(NL.vw.BUBBLE.$('.title')).toHaveText('title2');
      expect(NL.vw.BUBBLE.$('.body')).toHaveText('body2');

    });

  });

  describe('unselect', function() {

    // ------------------------------------------------------------------------
    // When the bubble is unselected or manually closed, the bubble should be
    // hidden and start responding to highlight events.
    // ------------------------------------------------------------------------

    beforeEach(function() {
      Neatline.vent.trigger('select', { model: model1 });
    });

    afterEach(function() {

      // Bubble should be hidden.
      expect(NL.vw.BUBBLE.$el).not.toBeVisible();

      Neatline.vent.trigger('highlight', { model: model2 });

      // Should start responding to highlight events.
      expect(NL.vw.BUBBLE.$('.title')).toHaveText('title2');
      expect(NL.vw.BUBBLE.$('.body')).toHaveText('body2');

    });

    it('should close on unselect', function() {
      Neatline.vent.trigger('unselect', { model: model1 });
    });

    it('should close when "X" is clicked', function() {
      NL.vw.BUBBLE.$('.close').trigger('click');
    });

  });


});
