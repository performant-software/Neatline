
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


  var el, model;


  beforeEach(function() {
    _t.loadNeatline();
    model = new Neatline.Shared.Record.Model({
      presenter: 'StaticBubble', title: 'title', body: 'body'
    });
  });


  describe('show', function() {

    it('should display the title', function() {

      // ------------------------------------------------------------------
      // When the presenter is shown, the title should be displayed in the
      // container (the body should stay hidden).
      // ------------------------------------------------------------------

      Neatline.execute('PRESENTER:show', model);

      // Should populate title and body.
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body');

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

      Neatline.execute('PRESENTER:show', model);
      Neatline.execute('PRESENTER:hide', model);

      // Bubble should be empty.
      expect(_t.vw.BUBBLE.$el).toBeEmpty();

    });

  });


  // it('should freeze bubble on select', function() {

  //   // --------------------------------------------------------------------
  //   // When a feature is selected, the bubble should stay visible when the
  //   // cursor leaves the feature.
  //   // --------------------------------------------------------------------

  //   _t.hoverOnMapFeature(feature1);
  //   _t.clickOnMapFeature(feature1);
  //   _t.unHoverOnMapFeature();

  //   // Bubble should still be visible.
  //   expect(_t.vw.BUBBLE.$el).toBeVisible();

  // });


  // it('should show body and close "X" when body is not empty', function() {

  //   // --------------------------------------------------------------------
  //   // When a feature is selected and the record has a non-null body, the
  //   // body container and close "X" should be displayed.
  //   // --------------------------------------------------------------------

  //   layers[0].nModel.set('body', 'content');

  //   _t.hoverOnMapFeature(feature1);
  //   _t.clickOnMapFeature(feature1);

  //   // Body/X should be visible.
  //   expect(el.close).toBeVisible();
  //   expect(el.body).toBeVisible();

  // });


  // it('should not show body and close "X" when body is empty', function() {

  //   // --------------------------------------------------------------------
  //   // When a feature is selected and the record has a null body, the body
  //   // container and close "X" should not be displayed.
  //   // --------------------------------------------------------------------

  //   // Set null body.
  //   layers[0].nModel.set('body', null);

  //   // Highlight feature, then select.
  //   _t.hoverOnMapFeature(feature1);
  //   _t.clickOnMapFeature(feature1);

  //   // Body, "X" should be not visible.
  //   expect(el.body).not.toBeVisible();
  //   expect(el.close).not.toBeVisible();

  // });


  // it('should add the `frozen` class on feature select', function() {

  //   // --------------------------------------------------------------------
  //   // When a feature is selected, the `frozen` class should be added.
  //   // --------------------------------------------------------------------

  //   _t.hoverOnMapFeature(feature1);
  //   _t.clickOnMapFeature(feature1);

  //   // Should add `frozen` class.
  //   expect(_t.vw.BUBBLE.$el).toHaveClass('frozen');

  // });


  // it('should not respond to hover events when frozen', function() {

  //   // --------------------------------------------------------------------
  //   // When the bubble is frozen and the cursor hovers over a feature for
  //   // a different record, the bubble should not render the new record.
  //   // --------------------------------------------------------------------

  //   _t.hoverOnMapFeature(feature1);
  //   _t.clickOnMapFeature(feature1);
  //   _t.hoverOnMapFeature(feature2);

  //   // Bubble content should not change.
  //   expect(el.title.text()).toEqual('title1');
  //   expect(el.body.text()).toEqual('body1');

  // });


  // it('should respond to click events when frozen', function() {

  //   // --------------------------------------------------------------------
  //   // When the bubble is frozen and a different feature is clicked, the
  //   // bubble should render the new record.
  //   // --------------------------------------------------------------------

  //   _t.hoverOnMapFeature(feature1);
  //   _t.clickOnMapFeature(feature1);
  //   _t.clickOnMapFeature(feature2);

  //   // Bubble content should change.
  //   expect(el.title.text()).toEqual('title2');
  //   expect(el.body.text()).toEqual('body2');

  // });


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
