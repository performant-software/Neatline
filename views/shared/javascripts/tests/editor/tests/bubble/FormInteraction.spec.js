
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for how the bubble interacts with the editing form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Bubble Form Interaction', function() {

  var mapLayers, layer, feature;

  // Start editor.
  beforeEach(function() {

    _t.loadEditor();

    // Get layers.
    mapLayers = _t.getVectorLayers();

    // Alias layer and feature.
    layer = mapLayers[0];
    feature = layer.features[0];

  });

  it('should hide bubble when the spatial tab is selected', function() {

    // --------------------------------------------------------------------
    // An open bubble should be closed when the spatial tab is activated.
    // --------------------------------------------------------------------

    // Select a feature, open bubble.
    _t.hoverOnMapFeature(layer, feature);
    _t.clickOnMapFeature(layer, feature);

    // Click the "Spatial" tab.
    $('a[href="#form-spatial"]').tab('show');

    // Bubble should be hidden
    expect(_t.bubbleView.$el).not.toBeVisible();

  });

  it('should hide bubble when the form is closed', function() {

    // --------------------------------------------------------------------
    // An open bubble should be closed when the form is closed.
    // --------------------------------------------------------------------

    // Select a feature, open bubble.
    _t.hoverOnMapFeature(layer, feature);
    _t.clickOnMapFeature(layer, feature);

    // Close the form.
    _t.formView.closeButton.trigger('click');

    // Bubble should be hidden
    expect(_t.bubbleView.$el).not.toBeVisible();

  });

  it('should not show bubble when the spatial tab is active', function() {

    // --------------------------------------------------------------------
    // While the spatial tab is active, the bubble should not be displayed
    // or frozen when the cursor interacts with map geometries. This is to
    // prevent confusing interactions with the bubble while geometries are
    // being created or edited.
    // --------------------------------------------------------------------

    // Open form.
    var recordRows = _t.getRecordRows();
    $(recordRows[0]).trigger('click');

    // Click the "Spatial" tab.
    $('a[href="#form-spatial"]').tab('show');

    // Hover on feature, check no bubble.
    _t.hoverOnMapFeature(layer, feature);
    expect(_t.bubbleView.$el).not.toBeVisible();

    // Select feature, check no bubble.
    _t.hoverOnMapFeature(layer, feature);
    _t.clickOnMapFeature(layer, feature);
    expect(_t.bubbleView.$el).not.toBeVisible();

  });

  it('should activate bubble when spatial tab is inactive', function() {

    // --------------------------------------------------------------------
    // When the spatial tab is closed, the bubble should be reactivated.
    // --------------------------------------------------------------------

    // Open form.
    var recordRows = _t.getRecordRows();
    $(recordRows[0]).trigger('click');

    // Click the "Spatial" tab.
    $('a[href="#form-spatial"]').tab('show');

    // Click back to the "Text" tab.
    $('a[href="#form-text"]').tab('show');

    // Hover on feature, check bubble.
    _t.hoverOnMapFeature(layer, feature);
    expect(_t.bubbleView.$el).toBeVisible();

  });

});
