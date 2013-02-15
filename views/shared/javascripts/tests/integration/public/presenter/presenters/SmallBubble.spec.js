
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for small bubble presenter.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Small Bubble', function() {


  var layer1, layer2, feature1, feature2, els;


  beforeEach(function() {

    _t.loadNeatline();

    layer1 = _t.vw.map.layers[0];
    layer2 = _t.vw.map.layers[1];

    feature1 = layer1.features[0];
    feature2 = layer2.features[0];

    els = {
      title:  _t.vw.smallBubble.$('.title'),
      body:   _t.vw.smallBubble.$('.body')
    };

  });


  it('should show the bubble on feature hover', function() {

    // --------------------------------------------------------------------
    // The bubble should be displayed when the cursor hovers on a feature.
    // --------------------------------------------------------------------

    // Hover on feature.
    _t.hoverOnMapFeature(layer1, feature1);

    // Bubble should be visible.
    expect(_t.el.smallBubble).toBeVisible();

    // Title and body should be rendered.
    expect(els.title.text()).toEqual('_title1');
    expect(els.body.text()).toEqual('_body1');

  });


  it('should track the cursor during hover', function() {

    // --------------------------------------------------------------------
    // When the cursor is hovering over a feature, the bubble should track
    // the movement of the cursor.
    // --------------------------------------------------------------------

    // Spy on the `position` method.
    var position = spyOn(_t.vw.smallBubble, 'position');

    // Hover on feature.
    _t.hoverOnMapFeature(layer1, feature1);

    // Move the cursor.
    _t.vw.map.map.events.triggerEvent('mousemove', {
      xy: new OpenLayers.Pixel(0,0),
      clientX: 1,
      clientY: 1
    });

    // `position` should be called.
    expect(position).toHaveBeenCalled();

  });


  it('should hide bubble on feature unhover', function() {

    // --------------------------------------------------------------------
    // The bubble should be hidden when the cursor unhovers on a feature.
    // --------------------------------------------------------------------

    // Highlight, unhighlight feature.
    _t.hoverOnMapFeature(layer1, feature1);
    _t.unHoverOnMapFeature(_t.vw.map.layers);

    // Bubble should not be visible.
    expect(_t.el.smallBubble).not.toBeVisible();

  });


  it('should hide bubble when the cursor leaves the exhibit', function() {

    // --------------------------------------------------------------------
    // The bubble should be hidden when the cursor leaves the exhibit.
    // --------------------------------------------------------------------

    // Move cursor out of the exhibit.
    _t.hoverOnMapFeature(layer1, feature1);
    _t.triggerMapMouseout();

    // Bubble should not be visible.
    expect(_t.el.smallBubble).not.toBeVisible();

  });


  it('should freeze bubble on feature select', function() {

    // --------------------------------------------------------------------
    // When a feature is selected. It should stop tracking the cursor and
    // stay visible when the cursor leaves the feature.
    // --------------------------------------------------------------------

    // Highlight feature, then select.
    _t.hoverOnMapFeature(layer1, feature1);
    _t.clickOnMapFeature(layer1, feature1);

    // Capture the offset.
    var offset = _t.el.smallBubble.offset();

    // Move the cursor.
    _t.vw.map.map.events.triggerEvent('mousemove', {
      xy: new OpenLayers.Pixel(0,0),
      clientX: 3,
      clientY: 4
    });

    // Bubble should not move.
    expect(_t.el.smallBubble.offset()).toEqual(offset);

    // Bubble should be visible after unhover.
    _t.unHoverOnMapFeature(_t.vw.map.layers);
    expect(_t.el.smallBubble).toBeVisible();

  });


  it('should not respond to hover events when frozen', function() {

    // --------------------------------------------------------------------
    // When the bubble is frozen and the cursor hovers over a feature for
    // a different record, the bubble should not show the data for the new
    // record and should not track the cursor.
    // --------------------------------------------------------------------

    // Hover on feature, then select.
    _t.hoverOnMapFeature(layer1, feature1);
    _t.clickOnMapFeature(layer1, feature1);

    // Capture the offset.
    var offset = _t.el.smallBubble.offset();

    // Hover on a different feature.
    _t.hoverOnMapFeature(layer2, feature2);

    // Bubble values should be unchanged.
    expect(els.title.text()).toEqual('_title1');
    expect(els.body.text()).toEqual('_body1');

    // Move the cursor.
    _t.vw.map.map.events.triggerEvent('mousemove', {
      xy: new OpenLayers.Pixel(0,0),
      clientX: 3,
      clientY: 4
    });

    // Bubble should not move.
    expect(_t.el.smallBubble.offset()).toEqual(offset);

  });


  it('should unselect bubble on feature unselect', function() {

    // --------------------------------------------------------------------
    // When a feature is unselected, the bubble should disappear and start
    // responding to new hover events.
    // --------------------------------------------------------------------

    // Hover on feature, then select.
    _t.hoverOnMapFeature(layer1, feature1);
    _t.clickOnMapFeature(layer1, feature1);

    // Unselect the feature.
    _t.clickOffMapFeature(_t.vw.map.layers);

    // Bubble should disappear.
    expect(_t.el.smallBubble).not.toBeVisible();

    // Hover on a different feature.
    _t.hoverOnMapFeature(layer2, feature2);
    var offset = _t.el.smallBubble.offset();

    // Bubble values should be changed.
    expect(els.title.text()).toEqual('_title2');

    // Move the cursor.
    _t.vw.map.map.events.triggerEvent('mousemove', {
      xy: new OpenLayers.Pixel(0,0),
      clientX: 3,
      clientY: 4
    });

    // Bubble should track the cursor.
    expect(_t.el.smallBubble.offset()).not.toEqual(offset);

  });


  it('should hide the bubble on deactivate', function() {

    // --------------------------------------------------------------------
    // When presenter is deactivated, the bubble should disappear.
    // --------------------------------------------------------------------

    // Hover on feature, then select.
    _t.hoverOnMapFeature(layer1, feature1);
    _t.clickOnMapFeature(layer1, feature1);

    // Deactivate the presenter.
    Neatline.vent.trigger('presenter:deactivate');

    // Bubble should disappear.
    expect(_t.el.smallBubble).not.toBeVisible();

  });


  it('should not respond to cursor events when deactivated', function() {

    // --------------------------------------------------------------------
    // The bubble should not respond to cursor events when deactivated.
    // --------------------------------------------------------------------

    // Deactivate the presenter.
    Neatline.vent.trigger('presenter:deactivate');

    // Hover on feature.
    _t.hoverOnMapFeature(layer1, feature1);

    // Bubble should not be visible.
    expect(_t.el.smallBubble).not.toBeVisible();

    // Click on feature.
    _t.clickOnMapFeature(layer1, feature1);

    // Bubble should not be visible.
    expect(_t.el.smallBubble).not.toBeVisible();

  });


  it('should responding to hover events when activated', function() {

    // --------------------------------------------------------------------
    // When the presenter is activated after being deactivated, the bubble
    // should start responding to cursor events.
    // --------------------------------------------------------------------

    // Deactivate, activate the presenter.
    Neatline.vent.trigger('presenter:deactivate');
    Neatline.vent.trigger('presenter:activate');

    // Hover on feature.
    _t.hoverOnMapFeature(layer1, feature1);

    // Bubble should be visible.
    expect(_t.el.smallBubble).toBeVisible();

  });


  describe('position', function() {


    it('should render default position');
    it('should switch bubble to left when right edge is off-screen');
    it('should stick at top when top is off-screen');
    it('should stick at bottom when bottom is off-screen');
    it('should fill height when bubble is taller than window');


  });


});
