
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Static bubble tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Static Bubble', function() {


  var el, model1, model2;


  beforeEach(function() {

    _t.loadNeatline();

    model1 = new Neatline.Shared.Record.Model({
      presenter: 'StaticBubble', title: 'title1', body: 'body1'
    });

    model2 = new Neatline.Shared.Record.Model({
      presenter: 'StaticBubble', title: 'title2', body: 'body2'
    });

  });


  describe('show', function() {

    it('should display the title', function() {

      // ------------------------------------------------------------------
      // When the presenter is shown, the title should be displayed in the
      // container and the body should remain hidden.
      // ------------------------------------------------------------------

      Neatline.execute('PRESENTER:show', model1);

      // Should populate title and body.
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body1');

      // Title should be visible.
      expect(_t.vw.BUBBLE.$('.title')).toBeVisible();

      // Body should stay hidden.
      expect(_t.vw.BUBBLE.$('.body')).not.toBeVisible();

    });

  });


  describe('hide', function() {

    it('should empty bubble on `hide`', function() {

      // ------------------------------------------------------------------
      // When the presenter is hidden, the bubble should be emptied.
      // ------------------------------------------------------------------

      Neatline.execute('PRESENTER:show', model1);
      Neatline.execute('PRESENTER:hide', model1);

      // Bubble should be empty.
      expect(_t.vw.BUBBLE.$el).toBeEmpty();

    });

  });


  describe('select', function() {

    it('should show body and "X" when body is not empty', function() {

      // ------------------------------------------------------------------
      // When the presenter is selected and the record has body content,
      // the body container and close "X" should be displayed.
      // ------------------------------------------------------------------

      Neatline.execute('PRESENTER:select', model1);

      // Body and close "X" should be visible.
      expect(_t.vw.BUBBLE.$('.body')).toBeVisible();
      expect(_t.vw.BUBBLE.$('.close')).toBeVisible();

    });

    it('should not show body and "X" when body is empty', function() {

      // ------------------------------------------------------------------
      // When the presenter is selected and the record has a null body,
      // the body container and close "X" should _not_ be displayed.
      // ------------------------------------------------------------------

      model1.set('body', null);
      Neatline.execute('PRESENTER:select', model1);

      // Body and close "X" should be visible.
      expect(_t.vw.BUBBLE.$('.body')).not.toBeVisible();
      expect(_t.vw.BUBBLE.$('.close')).not.toBeVisible();

    });

    it('should add `bound` and `frozen` classes', function() {

      // ------------------------------------------------------------------
      // When the presenter is selected, the `bound` and `frozen` classes
      // should be added to the container.
      // ------------------------------------------------------------------

      Neatline.execute('PRESENTER:select', model1);

      // Should have `bound` and `frozen` classes.
      expect(_t.vw.BUBBLE.$el).toHaveClass('bound');
      expect(_t.vw.BUBBLE.$el).toHaveClass('frozen');

    });

    it('should stay visible on `hide`', function() {

      // ------------------------------------------------------------------
      // When the presenter is selected, the bubble should not be emptied 
      // when the presenter is hidden.
      // ------------------------------------------------------------------

      Neatline.execute('PRESENTER:select', model1);
      Neatline.execute('PRESENTER:hide', model1);

      // Should not empty the bubble.
      expect(_t.vw.BUBBLE.$el).not.toBeEmpty();

    });

    it('should not respond to `show` events', function() {

      // ------------------------------------------------------------------
      // When the presenter is selected, the bubble should not respond to
      // `show` events for other records.
      // ------------------------------------------------------------------

      Neatline.execute('PRESENTER:select', model1);
      Neatline.execute('PRESENTER:show', model2);

      // Should not bind new model.
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body1');

    });

    it('should not respond to `select` events', function() {

      // ------------------------------------------------------------------
      // When the presenter is selected, the bubble should respond to
      // `select` events for other records.
      // ------------------------------------------------------------------

      Neatline.execute('PRESENTER:select', model1);
      Neatline.execute('PRESENTER:select', model2);

      // Should bind new model.
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title2');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body2');

    });

  });


  // describe('close', function() {

  //   // --------------------------------------------------------------------
  //   // When a bubble is unfrozen by clicking on the map or the close "X",
  //   // the bubble should disappear and start responding to hover events.
  //   // --------------------------------------------------------------------

  //   beforeEach(function() {
  //     _t.hoverOnMapFeature(feature1);
  //     _t.clickOnMapFeature(feature1);
  //   });

  //   afterEach(function() {

  //     // Bubble should disappear.
  //     expect(_t.vw.BUBBLE.$el).not.toBeVisible();

  //     _t.hoverOnMapFeature(feature2);

  //     // Bubble values should be changed.
  //     expect(el.title.text()).toEqual('title2');
  //     expect(el.body.text()).toEqual('body2');

  //   });

  //   it('should unfreeze bubble on close click', function() {
  //     el.close.trigger('click');
  //   });

  //   it('should unfreeze bubble on feature unselect', function() {
  //     _t.clickOffMapFeature();
  //   });

  // });


  // it('should hide body on unselect', function() {

  //   // --------------------------------------------------------------------
  //   // When a feature is unselected, the body should be hidden so that it
  //   // is not visible the next time the cursor hovers on a feature.
  //   // --------------------------------------------------------------------

  //   _t.hoverOnMapFeature(feature1);
  //   _t.clickOnMapFeature(feature1);
  //   _t.clickOffMapFeature();
  //   _t.hoverOnMapFeature(feature1);

  //   // Body should be hidden.
  //   expect(el.body).not.toBeVisible();

  // });


  // it('should remove the `frozen` class on feature unselect', function() {

  //   // --------------------------------------------------------------------
  //   // When a feature is selected, the `frozen` class should be removed.
  //   // --------------------------------------------------------------------

  //   _t.hoverOnMapFeature(feature1);
  //   _t.clickOnMapFeature(feature1);
  //   _t.clickOffMapFeature();

  //   // Should remove `frozen` class.
  //   expect(_t.vw.BUBBLE.$el).not.toHaveClass('frozen');

  // });


  // it('should hide the bubble on deactivate', function() {

  //   // --------------------------------------------------------------------
  //   // When presenter is deactivated, the bubble should disappear.
  //   // --------------------------------------------------------------------

  //   _t.hoverOnMapFeature(feature1);
  //   _t.clickOnMapFeature(feature1);
  //   Neatline.vent.trigger('PRESENTER:deactivate');

  //   // Bubble should disappear.
  //   expect(_t.vw.BUBBLE.$el).not.toBeVisible();

  // });


  // it('should not respond to cursor events when deactivated', function() {

  //   // --------------------------------------------------------------------
  //   // The bubble should not respond to cursor events when deactivated.
  //   // --------------------------------------------------------------------

  //   Neatline.vent.trigger('PRESENTER:deactivate');
  //   _t.hoverOnMapFeature(feature1);

  //   // Bubble should not be visible.
  //   expect(_t.vw.BUBBLE.$el).not.toBeVisible();

  // });


  // it('should respond to cursor events when activated', function() {

  //   // --------------------------------------------------------------------
  //   // When the presenter is activated after being deactivated, the bubble
  //   // should start responding to cursor events.
  //   // --------------------------------------------------------------------

  //   Neatline.vent.trigger('PRESENTER:deactivate');
  //   Neatline.vent.trigger('PRESENTER:activate');
  //   _t.hoverOnMapFeature(feature1);

  //   // Bubble should be visible.
  //   expect(_t.vw.BUBBLE.$el).toBeVisible();

  // });


});
