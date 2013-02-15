
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for medium bubble presenter.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Medium Bubble', function() {


  var layer, feature, els;


  beforeEach(function() {

    _t.loadNeatline();

    // Get layer and feature.
    layer = _t.vw.map.layers[0];
    feature = layer.features[0];

    // Set presenter.
    layer.nModel.set('presenter', 'MediumBubble');

    els = {
      title:  _t.vw.mediumBubble.$('.title'),
      body:   _t.vw.mediumBubble.$('.body')
    };

  });


  it('should show the title but not the body on hover', function() {

    // --------------------------------------------------------------------
    // When the cursor hovers on a feature, the title should be displayed
    // but the body should be hidden.
    // --------------------------------------------------------------------

    // Hover on feature.
    _t.hoverOnMapFeature(layer, feature);

    // Title should be visible.
    expect(els.title).toBeVisible();

    // Body should be hidden.
    expect(els.body).not.toBeVisible();

  });


  it('should show the body on select', function() {

    // --------------------------------------------------------------------
    // When a feature is selected, the body should be displayed.
    // --------------------------------------------------------------------

    // Hover on feature, then select.
    _t.hoverOnMapFeature(layer, feature);
    _t.clickOnMapFeature(layer, feature);

    // Body should be visible.
    expect(els.body).toBeVisible();

  });


  it('should hide the body on unselect', function() {

    // --------------------------------------------------------------------
    // When a feature is unselected, the body should be hidden, so that it
    // is not visible the next time the cursor hovers on a feature.
    // --------------------------------------------------------------------

    // Hover on feature, then select.
    _t.hoverOnMapFeature(layer, feature);
    _t.clickOnMapFeature(layer, feature);

    // Unselect the feature.
    _t.clickOffMapFeature(_t.vw.map.layers);

    // Hover on feature again.
    _t.hoverOnMapFeature(layer, feature);

    // Body should be hidden.
    expect(els.body).not.toBeVisible();

  });


});
