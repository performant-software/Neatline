
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


  var layer1, layer2, feature1, feature2, els;


  beforeEach(function() {

    _t.loadNeatline();

    // Get layers.
    layer1 = _t.vw.map.layers[0];
    layer2 = _t.vw.map.layers[1];

    // Get features.
    feature1 = layer1.features[0];
    feature2 = layer2.features[0];

    // Set presenters.
    layer1.nModel.set('presenter', 'StaticBubble');
    layer2.nModel.set('presenter', 'StaticBubble');

    els = {
      title:  _t.vw.staticBubble.$('.title'),
      body:   _t.vw.staticBubble.$('.body'),
      close:  _t.vw.staticBubble.$('.close')
    };

  });


  it('should show title on feature hover', function() {

    // --------------------------------------------------------------------
    // When the cursor hovers on a feature, the bubble should be populated
    // with values and the title should be displayed in the map container.
    // --------------------------------------------------------------------

    // Hover on feature.
    _t.hoverOnMapFeature(feature1);

    // Title and body should be rendered.
    expect(els.title.text()).toEqual('_title1');
    expect(els.body.text()).toEqual('_body1');

    // Bubble should be injected into map.
    expect(_t.el.map).toContain(_t.el.staticBubble);

    // Title should be visible.
    expect(els.title).toBeVisible();

    // Body should be hidden.
    expect(els.body).not.toBeVisible();

  });


  it('should hide bubble on feature unhover', function() {

    // --------------------------------------------------------------------
    // When the cursor unhovers on a feature, the bubble should disappear.
    // --------------------------------------------------------------------

    // Highlight, unhighlight feature.
    _t.hoverOnMapFeature(feature1);
    _t.unHoverOnMapFeature();

    // Bubble should not be visible.
    expect(_t.el.staticBubble).not.toBeVisible();

  });


  it('should hide bubble when the cursor leaves the exhibit', function() {

    // --------------------------------------------------------------------
    // When the cursor leaves the exhibit, the bubble should disappear.
    // --------------------------------------------------------------------

    // Move cursor out of the exhibit.
    _t.hoverOnMapFeature(feature1);
    _t.triggerMapMouseout();

    // Bubble should not be visible.
    expect(_t.el.staticBubble).not.toBeVisible();

  });


  it('should freeze bubble on feature select', function() {

    // --------------------------------------------------------------------
    // When a feature is selected, the bubble should stay visible when the
    // cursor leaves the feature.
    // --------------------------------------------------------------------

    // Highlight feature, then select.
    _t.hoverOnMapFeature(feature1);
    _t.clickOnMapFeature(feature1);

    // Bubble should be visible on unhover.
    _t.unHoverOnMapFeature();
    expect(_t.el.staticBubble).toBeVisible();

  });


  it('should show body on select when body is not empty', function() {

    // --------------------------------------------------------------------
    // When a feature is selected and the bubble record has a non-null
    // body, the body container should be displayed.
    // --------------------------------------------------------------------

    // Set non-null body.
    layer1.nModel.set('body', 'content');

    // Highlight feature, then select.
    _t.hoverOnMapFeature(feature1);
    _t.clickOnMapFeature(feature1);

    // Body should be visible.
    expect(els.body).toBeVisible();

  });


  it('should not show body on select when body is empty', function() {

    // --------------------------------------------------------------------
    // When a feature is selected and the bubble record has a null body,
    // the body container should not be displayed.
    // --------------------------------------------------------------------

    // Set null body.
    layer1.nModel.set('body', null);

    // Highlight feature, then select.
    _t.hoverOnMapFeature(feature1);
    _t.clickOnMapFeature(feature1);

    // Body should be not visible.
    expect(els.body).not.toBeVisible();

  });


  it('should add the `frozen` class on feature select', function() {

    // --------------------------------------------------------------------
    // When a feature is selected, the `frozen` class should be added.
    // --------------------------------------------------------------------

    // Highlight feature, then select.
    _t.hoverOnMapFeature(feature1);
    _t.clickOnMapFeature(feature1);

    // Should add `frozen` class.
    expect(_t.el.staticBubble).toHaveClass('frozen');

  });


  it('should not respond to cursor events when frozen', function() {

    // --------------------------------------------------------------------
    // When the bubble is frozen and the cursor hovers over a feature for
    // a different record, the bubble should not render the new record.
    // --------------------------------------------------------------------

    // Hover on feature, then select.
    _t.hoverOnMapFeature(feature1);
    _t.clickOnMapFeature(feature1);

    // Hover on a different feature.
    _t.hoverOnMapFeature(feature2);

    // Bubble values should be unchanged.
    expect(els.title.text()).toEqual('_title1');
    expect(els.body.text()).toEqual('_body1');

  });


  describe('close', function() {

    // --------------------------------------------------------------------
    // When a bubble is unfrozen by clicking on the map or the close "X",
    // the bubble should disappear and start responding to hover events.
    // --------------------------------------------------------------------

    beforeEach(function() {

      // Hover on feature, then select.
      _t.hoverOnMapFeature(feature1);
      _t.clickOnMapFeature(feature1);

    });

    afterEach(function() {

      // Bubble should disappear.
      expect(_t.el.staticBubble).not.toBeVisible();

      // Hover on a different feature.
      _t.hoverOnMapFeature(feature2);

      // Bubble values should be changed.
      expect(els.title.text()).toEqual('_title2');
      expect(els.body.text()).toEqual('_body2');

    });

    it('should unfreeze bubble on close click', function() {
      els.close.trigger('click');
    });

    it('should unfreeze bubble on feature unselect', function() {
      _t.clickOffMapFeature();
    });

  });


  it('should hide body on unselect', function() {

    // --------------------------------------------------------------------
    // When a feature is unselected, the body should be hidden so that it
    // is not visible the next time the cursor hovers on a feature.
    // --------------------------------------------------------------------

    // Hover on feature, then select.
    _t.hoverOnMapFeature(feature1);
    _t.clickOnMapFeature(feature1);

    // Unselect the feature.
    _t.clickOffMapFeature();

    // Hover on feature again.
    _t.hoverOnMapFeature(feature1);

    // Body should be hidden.
    expect(els.body).not.toBeVisible();

  });


  it('should remove the `frozen` class on feature unselect', function() {

    // --------------------------------------------------------------------
    // When a feature is selected, the `frozen` class should be removed.
    // --------------------------------------------------------------------

    // Hover on feature, then select.
    _t.hoverOnMapFeature(feature1);
    _t.clickOnMapFeature(feature1);

    // Unselect the feature.
    _t.clickOffMapFeature();

    // Should remove `frozen` class.
    expect(_t.el.staticBubble).not.toHaveClass('frozen');

  });


  it('should hide the bubble on deactivate', function() {

    // --------------------------------------------------------------------
    // When presenter is deactivated, the bubble should disappear.
    // --------------------------------------------------------------------

    // Hover on feature, then select.
    _t.hoverOnMapFeature(feature1);
    _t.clickOnMapFeature(feature1);

    // Deactivate the presenter.
    Neatline.vent.trigger('presenter:deactivate');

    // Bubble should disappear.
    expect(_t.el.staticBubble).not.toBeVisible();

  });


  it('should not respond to cursor events when deactivated', function() {

    // --------------------------------------------------------------------
    // The bubble should not respond to cursor events when deactivated.
    // --------------------------------------------------------------------

    // Deactivate the presenter.
    Neatline.vent.trigger('presenter:deactivate');

    // Hover on feature.
    _t.hoverOnMapFeature(feature1);

    // Bubble should not be visible.
    expect(_t.el.staticBubble).not.toBeVisible();

  });


  it('should respond to cursor events when activated', function() {

    // --------------------------------------------------------------------
    // When the presenter is activated after being deactivated, the bubble
    // should start responding to cursor events.
    // --------------------------------------------------------------------

    // Deactivate, activate the presenter.
    Neatline.vent.trigger('presenter:deactivate');
    Neatline.vent.trigger('presenter:activate');

    // Hover on feature.
    _t.hoverOnMapFeature(feature1);

    // Bubble should be visible.
    expect(_t.el.staticBubble).toBeVisible();

  });


});
