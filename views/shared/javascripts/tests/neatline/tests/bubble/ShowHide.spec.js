
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

  var mapLayers, layer, feature;

  // Start Neatline.
  beforeEach(function() {

    _t.loadNeatline();

    // Get map layers.
    mapLayers = _t.getVectorLayers();

    // Get layer and feature.
    layer = mapLayers[0];
    feature = layer.features[0];

  });

  it('should show bubble on feature hover', function() {

    // --------------------------------------------------------------------
    // The bubble should be shown when the cursor hovers over a feature.
    // --------------------------------------------------------------------

    // Simulate hover on feature.
    _t.hoverOnMapFeature(layer, feature);

    // Bubble should be visible.
    expect(_t.bubbleView.$el).toBeVisible();

  });

});
