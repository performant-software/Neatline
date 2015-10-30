
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Presenters | Static Bubble', function() {


  var model1, model2;


  beforeEach(function() {

    NL.loadNeatline();

    model1 = new Neatline.Shared.Record.Model({
      id:         1,
      presenter:  'StaticBubble',
      title:      'title1',
      body:       'body1',
      item:       'item1'
    });

    model2 = new Neatline.Shared.Record.Model({
      id:         2,
      presenter:  'StaticBubble',
      title:      'title2',
      body:       'body2',
      item:       'item2'
    });

  });


  it('should hide the bubble by default', function() {

    // ------------------------------------------------------------------------
    // By default, when the bubble is not displayed, the container should be
    // appended to the map container and invisible.
    // ------------------------------------------------------------------------

    expect(NL.v.map.$el).toContainHtml(NL.v.bubble.$el);
    expect(NL.v.bubble.$el).not.toBeVisible();

  });

  describe('highlight', function() {

    it('should bind record and show the title', function() {

      // ----------------------------------------------------------------------
      // When a record is highlighted, the the record should be bound to the
      // bubble and the title should be displayed in the map container.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('highlight', { model: model1 });

      // Title and content should be populated.
      expect(NL.v.bubble.$('.title')).toHaveText('title1');
      expect(NL.v.bubble.$('.body')).toHaveText('body1');
      expect(NL.v.bubble.$('.item')).toHaveText('item1');

      // Title should be visible.
      expect(NL.v.bubble.$('.title')).toBeVisible();

      // Close "X', body, and item should be hidden.
      expect(NL.v.bubble.$('.close')).not.toBeVisible();
      expect(NL.v.bubble.$('.body')).not.toBeVisible();
      expect(NL.v.bubble.$('.item')).not.toBeVisible();

    });

    it('should not show the close "X" or the body/item', function() {

      // ----------------------------------------------------------------------
      // The record content - the Neatline body and item content - should not
      // be displayed when the record is highlighted.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('highlight', { model: model1 });

      // Close "X', body, and item should be hidden.
      expect(NL.v.bubble.$('.close')).not.toBeVisible();
      expect(NL.v.bubble.$('.body')).not.toBeVisible();
      expect(NL.v.bubble.$('.item')).not.toBeVisible();

    });

    it('should not override a selected record', function() {

      // ----------------------------------------------------------------------
      // When a record is selected and another record is highlighted, the new
      // highlighted record should not be rendered in the bubble.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('select', { model: model1 });
      Neatline.vent.trigger('highlight', { model: model2 });

      // Title and body/item should not change.
      expect(NL.v.bubble.$('.title')).toHaveText('title1');
      expect(NL.v.bubble.$('.body')).toHaveText('body1');
      expect(NL.v.bubble.$('.item')).toHaveText('item1');

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
      expect(NL.v.bubble.$el).not.toBeVisible();

    });

    it('should not hide the bubble if it is selected', function() {

      // ----------------------------------------------------------------------
      // If the record has been selected, the bubble should not be hidden when
      // `unhighlight` is called with the same record.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('select', { model: model1 });
      Neatline.vent.trigger('unhighlight', { model: model1 });

      // Bubble should not be hidden.
      expect(NL.v.bubble.$el).toBeVisible();

    });

    it('should hide the bubble when cursor leaves the map', function() {

      // ----------------------------------------------------------------------
      // When the cursor leaves the map, the bubble should be hidden.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('highlight', { model: model1 });
      NL.triggerMapMouseout();

      // Bubble should be hidden.
      expect(NL.v.bubble.$el).not.toBeVisible();

    });

  });

  describe('select', function() {

    it('should show close "X"', function() {

      // ----------------------------------------------------------------------
      // When a record is selected, the close "X" should be displayed.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('select', { model: model1 });

      // Close "X" should be visible.
      expect(NL.v.bubble.$('.close')).toBeVisible();

    });

    it('should show the body/item content when non-null', function() {

      // ----------------------------------------------------------------------
      // The body and item content should be displayed when it is non-null.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('select', { model: model1 });

      // Body and item should be visible.
      expect(NL.v.bubble.$('.body')).toBeVisible();
      expect(NL.v.bubble.$('.item')).toBeVisible();

    });

    it('should not show the body/item content when null', function() {

      // ----------------------------------------------------------------------
      // The body and item content should not be displayed when it is null.
      // ----------------------------------------------------------------------

      model1.set('body', null);
      model1.set('item', null);
      Neatline.vent.trigger('select', { model: model1 });

      // Body and item should not be visible.
      expect(NL.v.bubble.$('.body')).not.toBeVisible();
      expect(NL.v.bubble.$('.item')).not.toBeVisible();

    });

    it('should override a selected record', function() {

      // ----------------------------------------------------------------------
      // When a record is selected, it should be rendered in the bubble even
      // if another record is currently selected.
      // ----------------------------------------------------------------------

      Neatline.vent.trigger('select', { model: model1 });
      Neatline.vent.trigger('select', { model: model2 });

      // Bubble should be visible.
      expect(NL.v.bubble.$el).toBeVisible();

      // Content should change.
      expect(NL.v.bubble.$('.title')).toHaveText('title2');
      expect(NL.v.bubble.$('.body')).toHaveText('body2');
      expect(NL.v.bubble.$('.item')).toHaveText('item2');

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
      expect(NL.v.bubble.$el).not.toBeVisible();

      Neatline.vent.trigger('highlight', { model: model2 });

      // Should start responding to highlight events.
      expect(NL.v.bubble.$('.title')).toHaveText('title2');
      expect(NL.v.bubble.$('.body')).toHaveText('body2');
      expect(NL.v.bubble.$('.item')).toHaveText('item2');

    });

    it('should close on unselect', function() {
      Neatline.vent.trigger('unselect', { model: model1 });
    });

    it('should close when "X" is clicked', function() {
      NL.v.bubble.$('.close').trigger('click');
    });

  });


});
