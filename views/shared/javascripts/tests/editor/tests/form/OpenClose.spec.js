
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for form open and close.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Form Open/Close', function() {

  var recordRows, mapLayers, models, feature1, feature2;

  // Start editor.
  beforeEach(function() {

    _t.loadEditor();

    // Get records rows.
    recordRows = _t.getRecordRows();

    // Get layers and features.
    mapLayers = _t.getVectorLayers();
    feature1 = mapLayers[0].features[0];
    feature2 = mapLayers[1].features[0];

    // Get models.
    models = _t.recordsColl.models;

  });

  it('should open the form when a record row is clicked', function() {

    // --------------------------------------------------------------------
    // When one of the record listings in the left panel is clicked, the
    // list of records should be replaced by the edit form.
    // --------------------------------------------------------------------

    // Click on record listing.
    $(recordRows[0]).trigger('click');

    // Check for form, no records.
    expect(_t.recordsView.$el).toContain(_t.formView.form);
    expect(_t.recordsView.$el).not.toContain(_t.recordsView.ul);

  });

  it('should close the form when "Close" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Close" button at the bottom of the record edit form is
    // clicked, the form should disappear and the records list should be
    // re-rendered in the content pane.
    // --------------------------------------------------------------------

    // Open form, click close.
    $(recordRows[0]).trigger('click');
    _t.formView.closeButton.trigger('click');

    // Check for records list, no form.
    expect(_t.recordsView.$el).not.toContain(_t.formView.form);
    expect(_t.recordsView.$el).toContain(_t.recordsView.ul);

    // 3 records in browser pane.
    recordRows = _t.getRecordRows();
    expect(recordRows.length).toEqual(3);
    expect($(recordRows[0]).find('.record-title').text()).
      toEqual('Title 1');
    expect($(recordRows[0]).find('.record-body').text()).
      toEqual('Body 1.');
    expect($(recordRows[1]).find('.record-title').text()).
      toEqual('Title 2');
    expect($(recordRows[1]).find('.record-body').text()).
      toEqual('Body 2.');
    expect($(recordRows[2]).find('.record-title').text()).
      toEqual('Title 3');
    expect($(recordRows[2]).find('.record-body').text()).
      toEqual('Body 3.');

  });

  it('should create map edit layer when one does not exist', function() {

    // --------------------------------------------------------------------
    // When an edit form is opened for a record that does not already have
    // a corresponding map layer (for example, when the record list is not
    // set in map mirroring mode, and there are listings for records that
    // are not visible in the current viewport on the map), the model for
    // the record housed in the editor application should be passed to the
    // map and used to create a map layer for the record on the fly.
    // --------------------------------------------------------------------

    // Load map without Record 2.
    _t.refreshMap(_t.json.collections.removed);

    // Just 1 layer on the map.
    expect(_t.mapView.layers.length).toEqual(1);

    // Open form for Record 2.
    $(recordRows[1]).trigger('click');

    // Check for new layer.
    mapLayers = _t.getVectorLayers();
    expect(mapLayers.length).toEqual(2);
    expect(mapLayers[1].features[0].geometry.x).toEqual(3);
    expect(mapLayers[1].features[0].geometry.y).toEqual(4);

  });

  it('should show the "Text" tab on first form open', function() {

    // --------------------------------------------------------------------
    // When a form is opened for the first time in an editing session, the
    // "Text" tab should be activated by default.
    // --------------------------------------------------------------------

    // Open form.
    $(recordRows[0]).trigger('click');

    // Check for visible "Text."
    expect($('#form-text')).toHaveClass('active');

    // "Spatial" and "Style" should be invisible.
    expect($('#form-spatial')).not.toHaveClass('active');
    expect($('#form-style')).not.toHaveClass('active');

  });

  it('should retain tab state after first form open', function() {

    // --------------------------------------------------------------------
    // If a given tab (eg, "Spatial") is selected when the form is closed,
    // that same tab should still be selected when the form is re-opened.
    // --------------------------------------------------------------------

    // Open Record 1 form.
    $(recordRows[0]).trigger('click');

    // Select "Spatial" tab.
    $('a[href="#form-spatial"]').tab('show');

    // Close Record 1 form.
    _t.formView.closeButton.trigger('click');

    // Open Record 2.
    recordRows = _t.getRecordRows();
    $(recordRows[1]).trigger('click');

    // "Spatial" should still be visible.
    expect($('#form-spatial')).toHaveClass('active');

    // "Text" and "Style" should be invisible.
    expect($('#form-text')).not.toHaveClass('active');
    expect($('#form-style')).not.toHaveClass('active');

  });

  it('should show form when a map feature is clicked', function() {

    // --------------------------------------------------------------------
    // When a vector geometry on the map is clicked and an edit form isn't
    // already open, the edit form that corresponds to the geometry should
    // be displayed in the left pane.
    // --------------------------------------------------------------------

    // Trigger click.
    _t.clickOnMapFeature(mapLayers[0], feature1);

    // Check for form.
    expect(_t.recordsView.$el).toContain(_t.formView.form);
    expect(_t.recordsView.$el).not.toContain(_t.recordsView.ul);
    expect(_t.formView.model.get('title')).toEqual('Title 1');

  });

  it('should not open new form in response to map click', function() {

    // --------------------------------------------------------------------
    // When an edit form is already open, clicking on a map feature that
    // corresponds to a different model from the one bound to the form
    // should _not_ open the new form. This makes it impossible to
    // accidentally switch to another edit form by clicking on a feature
    // that belongs to a different record while drawing shapes in close
    // proximity to other vectors.
    // --------------------------------------------------------------------

    // Trigger click on Record 1 feature.
    _t.clickOnMapFeature(mapLayers[0], feature1);

    // Check for form.
    expect(_t.recordsView.$el).toContain(_t.formView.form);
    expect(_t.recordsView.$el).not.toContain(_t.recordsView.ul);
    expect(_t.formView.model.get('title')).toEqual('Title 1');

    // Trigger click on Record 2 feature.
    _t.clickOnMapFeature(mapLayers[0], feature2);

    // Check for unchanged form.
    expect(_t.formView.model.get('title')).toEqual('Title 1');

  });

  it('should focus map when the form is opened via editor', function() {

    // --------------------------------------------------------------------
    // When an edit form is opened by way of the records pane (when the
    // user clicks on one of the listings), the map should focus on the
    // geometry vectors for that record.
    // --------------------------------------------------------------------

    // Set center and zoom.
    _t.setMapCenter(200, 300, 15);

    // Click on record listing.
    $(recordRows[0]).trigger('click');

    // Get focus and zoom.
    var center = _t.mapView.map.getCenter();
    var zoom = _t.mapView.map.getZoom();

    // Check unchanged focus.
    expect(center.lon).toEqual(100);
    expect(center.lat).toEqual(200);
    expect(zoom).toEqual(10);

  });

  it('should not focus map when the form is opened via map', function() {

    // --------------------------------------------------------------------
    // When the user clicks on a map vector to open an edit form, the map
    // should _not_ jump to the default focus position for the record that
    // corresponds to the clicked geometry. This to prevent lurching,
    // disorienting leaps that can occur when the default zoom for the
    // clicked record is much wider or tighter than the current map zoom.
    // --------------------------------------------------------------------

    // Set center and zoom.
    _t.setMapCenter(200, 300, 15);

    // Trigger click on Record 1 feature.
    _t.clickOnMapFeature(mapLayers[0], feature1);

    // Get focus and zoom.
    var center = _t.mapView.map.getCenter();
    var zoom = _t.mapView.map.getZoom();

    // Check unchanged focus.
    expect(center.lon).toEqual(200);
    expect(center.lat).toEqual(300);
    expect(zoom).toEqual(15);

  });

  it('should freeze edit layer when form opened via editor', function() {

    // --------------------------------------------------------------------
    // When an edit form for a record is opened by clicking on the record
    // listing in the left pane, the record id should be added to the
    // `frozen` array on the map view. This prevents the layer for the
    // record from being remove, replaced, or changed when new map data is
    // ingested after a map move, which would have the effect of removing
    // the layer instance with the editing controls and clearing out
    // unsaved changes/additions to the geometry.
    // --------------------------------------------------------------------

    // By default, frozen empty.
    expect(_t.mapView.frozen).toEqual([]);

    // Show form, check `frozen`.
    $(recordRows[0]).trigger('click');
    expect(_t.mapView.frozen).toEqual([models[0].get('id')]);

    // Close, check `frozen` empty.
    _t.formView.closeButton.trigger('click');
    expect(_t.mapView.frozen).toEqual([]);

  });

  it('should freeze edit layer when form opened via map', function() {

    // --------------------------------------------------------------------
    // When a form is opened by clicking on a map feature, the id of the
    // record should be added to the `frozen` array (see above).
    // --------------------------------------------------------------------

    // Trigger click on Record 1 feature.
    _t.clickOnMapFeature(mapLayers[0], feature1);

    // Check `frozen`.
    expect(_t.mapView.frozen).toEqual([models[0].get('id')]);

    // Close, check `frozen` empty.
    _t.formView.closeButton.trigger('click');
    expect(_t.mapView.frozen).toEqual([]);

  });

  it('should default to "Navigate" edit mode when opened', function() {

    // --------------------------------------------------------------------
    // The "Edit Geometry" controls should always revert to the default
    // "Navigate" mode when a form is opened, regardless of what the state
    // of the form was when it was last closed.
    // --------------------------------------------------------------------

    // Show form, check mode.
    $(recordRows[0]).trigger('click');
    expect(_t.spatialTabView.getMapControl()).toEqual('pan');

    // Activate "Polygon" control, check mode.
    $('input[name="editMode"]')[0].checked = false;
    $('input[name="editMode"]')[3].checked = true;
    expect(_t.spatialTabView.getMapControl()).toEqual('poly');

    // Close the form, re-get records.
    _t.formView.closeButton.trigger('click');
    recordRows = _t.recordsView.$el.find('.record-row');

    // Open new form, check mode.
    $(recordRows[1]).trigger('click');
    expect(_t.spatialTabView.getMapControl()).toEqual('pan');

  });

});
