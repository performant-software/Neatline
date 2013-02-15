
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

    // Get layers.
    layer1 = _t.vw.map.layers[0];
    layer2 = _t.vw.map.layers[1];

    // Get features.
    feature1 = layer1.features[0];
    feature2 = layer2.features[0];

    // Set presenters.
    layer1.nModel.set('presenter', 'SmallBubble');
    layer2.nModel.set('presenter', 'SmallBubble');

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

    // Should add `frozen` class.
    expect(_t.el.smallBubble).toHaveClass('frozen');

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

    // Should remove `frozen` class.
    expect(_t.el.smallBubble).not.toHaveClass('frozen');

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


    beforeEach(function() {

      // Hover on a feature.
      _t.hoverOnMapFeature(layer1, feature1);

      // Mock padding.
      _t.vw.smallBubble.options.pad.y = 1;
      _t.vw.smallBubble.options.pad.x = 2;

      // Mock window size.
      _t.vw.smallBubble.windowH = 500;
      _t.vw.smallBubble.windowW = 500;

      // Mock bubble size.
      _t.vw.smallBubble.$el.height(100);
      _t.vw.smallBubble.bubbleH = 100;
      _t.vw.smallBubble.$el.width(200);
      _t.vw.smallBubble.bubbleW = 200;

    });


    it('default', function() {

      // ------------------------------------------------------------------
      // When the bubble completely fits on screen, it should be rendered
      // to the right of the cursor with padding.
      // ------------------------------------------------------------------

      var e = {
        clientX: 50,
        clientY: 50
      }

      _t.vw.smallBubble.position(e);
      expect(_t.vw.smallBubble.$el.css('height')).toEqual('100px');
      expect(_t.vw.smallBubble.$el.css('top')).toEqual(50-1+'px');
      expect(_t.vw.smallBubble.$el.css('left')).toEqual(50+2+'px');

    });


    it('switched to left', function() {

      // ------------------------------------------------------------------
      // When the right edge of the bubble is occluded by the right edge
      // of the screen, the bubble should be switched to the left side.
      // ------------------------------------------------------------------

      var e = {
        clientX: 450,
        clientY: 50
      }

      _t.vw.smallBubble.position(e);
      expect(_t.vw.smallBubble.$el.css('left')).toEqual(450-200-2+'px');

    });


    it('flush with top', function() {

      // ------------------------------------------------------------------
      // When the top of the bubble is occluded by the top of the screen,
      // the bubble should be flush with the top of the screen.
      // ------------------------------------------------------------------

      var e = {
        clientX: 50,
        clientY: 0
      }

      _t.vw.smallBubble.position(e);
      expect(_t.vw.smallBubble.$el.css('top')).toEqual('0px');

    });


    it('flush with bottom', function() {

      // ------------------------------------------------------------------
      // When the bottom of the bubble is occluded by the bottom of the
      // screen, the bubble should be flush with the bottom of the screen.
      // ------------------------------------------------------------------

      var e = {
        clientX: 50,
        clientY: 500
      }

      _t.vw.smallBubble.position(e);
      expect(_t.vw.smallBubble.$el.css('top')).toEqual(500-100+'px');

    });


    it('full-height', function() {

      // ------------------------------------------------------------------
      // When the height of the bubble content is larger than the height
      // of the window, the bubble should be set to fill the entire height
      // of the window and vertical scrolling should be enabled.
      // ------------------------------------------------------------------

      _t.vw.smallBubble.bubbleH = 1000;

      var e = {
        clientX: 50,
        clientY: 50
      }

      _t.vw.smallBubble.position(e);
      expect(_t.vw.smallBubble.$el.outerHeight()).toEqual(500);
      expect(_t.vw.smallBubble.$el.css('overflow-y')).toEqual('scroll');

    });


  });


});
