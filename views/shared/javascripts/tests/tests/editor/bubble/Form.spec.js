
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for bubble interactions with the editing form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Bubble Form Interaction', function() {

  var recordRows, mapLayers, layer, feature, els;

  // Start editor.
  beforeEach(function() {

    _t.loadEditor();
    _t.openRecordForm();

    // Get layers and rows.
    recordRows  = _t.getRecordRows();
    mapLayers   = _t.getVectorLayers();

    // Alias layer and feature.
    layer = mapLayers[0]; feature = layer.features[0];

    els = {
      text:     _t.vw.record.$('a[href="#record-form-text"]'),
      spatial:  _t.vw.record.$('a[href="#record-form-spatial"]'),
      style:    _t.vw.record.$('a[href="#record-form-style"]'),
      close:    _t.vw.record.$('a[name="close"]')
    };

  });

  it('should hide bubble when the spatial tab is selected', function() {

    // --------------------------------------------------------------------
    // An open bubble should be closed when the spatial tab is activated.
    // --------------------------------------------------------------------

    // Select a feature, open bubble.
    _t.hoverOnMapFeature(layer, feature);
    _t.clickOnMapFeature(layer, feature);

    // Click "Spatial" tab.
    els.spatial.tab('show');

    // Bubble should be hidden
    expect(_t.el.bubble).not.toBeVisible();

  });

  it('should hide bubble when the form is closed', function() {

    // --------------------------------------------------------------------
    // An open bubble should be closed when the form is closed.
    // --------------------------------------------------------------------

    // Select a feature, open bubble.
    _t.hoverOnMapFeature(layer, feature);
    _t.clickOnMapFeature(layer, feature);

    // Close the form.
    els.close.trigger('click');
    _t.respondDefaultRecords();

    // Bubble should be hidden
    expect(_t.el.bubble).not.toBeVisible();

  });

  it('should not show bubble when the spatial tab is active', function() {

    // --------------------------------------------------------------------
    // While the spatial tab is active, the bubble should not be displayed
    // or frozen when the cursor interacts with map geometries. This is to
    // prevent confusing interactions with the bubble while geometries are
    // being created or edited.
    // --------------------------------------------------------------------

    // Click "Spatial" tab.
    els.spatial.tab('show');

    // Hover on feature, check no bubble.
    _t.hoverOnMapFeature(layer, feature);
    expect(_t.el.bubble).not.toBeVisible();

    // Select feature, check no bubble.
    _t.hoverOnMapFeature(layer, feature);
    _t.clickOnMapFeature(layer, feature);
    expect(_t.el.bubble).not.toBeVisible();

  });

  it('should activate bubble when spatial tab is inactive', function() {

    // --------------------------------------------------------------------
    // When the spatial tab is closed, the bubble should be reactivated.
    // --------------------------------------------------------------------

    // Click "Spatial" tab.
    els.spatial.tab('show');

    // Click "Text" tab.
    els.text.tab('show');

    // Hover on feature, check bubble.
    _t.hoverOnMapFeature(layer, feature);
    expect(_t.el.bubble).toBeVisible();

  });

  it('should activate bubble when the form is closed', function() {

    // --------------------------------------------------------------------
    // If the spatial tab is selected, the bubble should be deactivated;
    // but then if the form is closed while the spatial tab is still open,
    // the bubble should be reactivated.
    // --------------------------------------------------------------------

    // Click "Spatial" tab.
    els.spatial.tab('show');

    // Close the form.
    els.close.trigger('click');
    _t.respondDefaultRecords();

    // Hover on feature, check bubble.
    _t.hoverOnMapFeature(layer, feature);
    expect(_t.el.bubble).toBeVisible();

  });

  it('should deactivate bubble on open w/ spatial tab', function() {

    // --------------------------------------------------------------------
    // If the form is opened with the spatial tab already selected as the
    // default, the bubble should be deactivated.
    // --------------------------------------------------------------------

    // Click "Spatial" tab.
    els.spatial.tab('show');

    // Close the form.
    els.close.trigger('click');
    _t.respondDefaultRecords();

    // Reopen the form.
    _t.openRecordForm();

    // Hover on feature, check for no bubble.
    _t.hoverOnMapFeature(layer, feature);
    expect(_t.el.bubble).not.toBeVisible();

  });

});
