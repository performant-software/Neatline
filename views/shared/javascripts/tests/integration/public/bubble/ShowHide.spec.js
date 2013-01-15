
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Show/hide tests for bubble.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Bubble Show/Hide', function() {


  var layer1, layer2, feature1, feature2, els;


  beforeEach(function() {

    _t.loadNeatline();

    layer1 = _t.vw.map.layers[0];
    layer2 = _t.vw.map.layers[1];

    feature1 = layer1.features[0];
    feature2 = layer2.features[0];

    els = {
      title: _t.vw.bubble.$('.title')
    };

  });


  afterEach(function() {
    _t.el.bubble.remove();
  });


  it('should show bubble on feature hover', function() {

    // --------------------------------------------------------------------
    // The bubble should be displayed when the cursor hovers on a feature.
    // --------------------------------------------------------------------

    // Hover on feature1.
    _t.hoverOnMapFeature(layer1, feature1);

    // Bubble should be visible.
    expect(_t.el.bubble).toBeVisible();

    // Title should be rendered.
    expect(els.title.text()).toEqual('title1');

  });


  it('should hide bubble on feature unhover', function() {

    // --------------------------------------------------------------------
    // The bubble should be hidden when the cursor leaves a feature.
    // --------------------------------------------------------------------

    // Hover off feature.
    _t.hoverOnMapFeature(layer1, feature1);
    _t.unHoverOnMapFeature(_t.vw.map.layers);

    // Bubble should be visible.
    expect(_t.el.bubble).not.toBeVisible();

  });


  it('should hide bubble when the cursor leaves the exhibit', function() {

    // --------------------------------------------------------------------
    // The bubble should be hidden when the cursor leaves the top-level
    // `#neatline` container.
    // --------------------------------------------------------------------

    // Move cursor out of the exhibit.
    _t.hoverOnMapFeature(layer1, feature1);
    _t.triggerMapMouseout();

    // Bubble should be visible.
    expect(_t.el.bubble).not.toBeVisible();

  });


  it('should freeze bubble on feature select', function() {

    // --------------------------------------------------------------------
    // The bubble should be frozen when a feature is selected. The bubble
    // should stop tracking the cursor and should remain visible when the
    // cursor leaves the feature1.
    // --------------------------------------------------------------------

    // Hover, select.
    _t.hoverOnMapFeature(layer1, feature1);
    _t.clickOnMapFeature(layer1, feature1);

    // Capture current bubble offset.
    var offset = _t.el.bubble.offset();

    // Move the cursor.
    _t.vw.map.map.events.triggerEvent('mousemove', {
      xy: new OpenLayers.Pixel(0,0),
      clientX: 3,
      clientY: 4
    });

    // Bubble should not move.
    expect(_t.el.bubble.offset()).toEqual(offset);

    // Bubble should be visible after unhover.
    _t.unHoverOnMapFeature(_t.vw.map.layers);
    expect(_t.el.bubble).toBeVisible();

  });


  it('should not respond to hover events when frozen', function() {

    // --------------------------------------------------------------------
    // When the bubble is frozen and the cursor hovers over a feature for
    // a different record, the bubble should not show the data for the new
    // record and should not track the cursor.
    // --------------------------------------------------------------------

    // Hover, select.
    _t.hoverOnMapFeature(layer1, feature1);
    _t.clickOnMapFeature(layer1, feature1);

    // Capture current bubble offset.
    var offset = _t.el.bubble.offset();

    // Hover on a different feature.
    _t.hoverOnMapFeature(layer1, feature2);

    // Bubble values should be unchanged.
    expect(els.title.text()).toEqual('title1');

    // Move the cursor.
    _t.vw.map.map.events.triggerEvent('mousemove', {
      xy: new OpenLayers.Pixel(0,0),
      clientX: 3,
      clientY: 4
    });

    // Bubble should not move.
    expect(_t.el.bubble.offset()).toEqual(offset);

  });


  it('should unselect bubble on feature unselect', function() {

    // --------------------------------------------------------------------
    // When a feature is unselected, the bubble should disappear and start
    // responding to new hover events.
    // --------------------------------------------------------------------

    // Hover, select.
    _t.hoverOnMapFeature(layer1, feature1);
    _t.clickOnMapFeature(layer1, feature1);

    // Unselect.
    _t.clickOffMapFeature(_t.vw.map.layers);

    // Bubble should not be visible.
    expect(_t.el.bubble).not.toBeVisible();

    // Hover on a different feature.
    _t.hoverOnMapFeature(layer1, feature2);
    var offset = _t.el.bubble.offset();

    // Bubble values should be changed.
    expect(els.title.text()).toEqual('title2');

    // Move the cursor.
    _t.vw.map.map.events.triggerEvent('mousemove', {
      xy: new OpenLayers.Pixel(0,0),
      clientX: 3,
      clientY: 4
    });

    // Bubble should track the cursor.
    expect(_t.el.bubble.offset()).not.toEqual(offset);

  });


});
