
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record form open.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Open/Close', function() {

  var recordRows, recordModels, mapLayers, feature1, feature2;

  // Start editor.
  beforeEach(function() {

    _t.loadEditor();
    _t.navigate('records');

    // Get record rows and models.
    recordRows    = _t.getRecordRows();
    recordModels  = _t.getRecordModels();

    // Get layers and features.
    mapLayers     = _t.getVectorLayers();
    feature1      = mapLayers[0].features[0];
    feature2      = mapLayers[1].features[0];

  });

  it('should open the form when a record row is clicked', function() {

    // --------------------------------------------------------------------
    // When one of the record listings in the left panel is clicked, the
    // list of records should be replaced by the edit form.
    // --------------------------------------------------------------------

    // Click on record row.
    _t.click($(recordRows[0]));

    // Check for form, no records.
    expect(_t.el.editor).toContain(_t.el.record);
    expect(_t.el.editor).not.toContain(_t.el.records);

  });

  it('should populate form values', function() {

    // --------------------------------------------------------------------
    // When the edit form for a record is opened in the editor, the form
    // should render data from the record's model into the form fields.
    // --------------------------------------------------------------------

    // Open form.
    _t.click($(recordRows[0]));

    var favicon       = 'https://www.google.com/favicon.ico';
    var lead          = _t.el.record.find('p.lead');
    var title         = _t.el.record.find('textarea[name="title"]');
    var body          = _t.el.record.find('textarea[name="body"]');
    var coverage      = _t.el.record.find('textarea[name="coverage"]');
    var vectorColor   = _t.el.record.find('input[name="vector-color"]');
    var strokeColor   = _t.el.record.find('input[name="stroke-color"]');
    var selectColor   = _t.el.record.find('input[name="select-color"]');
    var vectorOpacity = _t.el.record.find('input[name="vector-opacity"]');
    var selectOpacity = _t.el.record.find('input[name="select-opacity"]');
    var strokeOpacity = _t.el.record.find('input[name="stroke-opacity"]');
    var imageOpacity  = _t.el.record.find('input[name="image-opacity"]');
    var strokeWidth   = _t.el.record.find('input[name="stroke-width"]');
    var pointRadius   = _t.el.record.find('input[name="point-radius"]');
    var minZoom       = _t.el.record.find('input[name="min-zoom"]');
    var maxZoom       = _t.el.record.find('input[name="max-zoom"]');
    var pointImage    = _t.el.record.find('input[name="point-image"]');
    var mapFocus      = _t.el.record.find('input[name="map-focus"]');
    var mapZoom       = _t.el.record.find('input[name="map-zoom"]');

    expect(lead).           toHaveText('title1');
    expect(title).          toHaveText('title1');
    expect(body).           toHaveText('body1');
    expect(coverage).       toHaveText('POINT(1 2)');
    expect(vectorColor).    toHaveValue('#111111');
    expect(strokeColor).    toHaveValue('#444444');
    expect(selectColor).    toHaveValue('#777777');
    expect(vectorOpacity).  toHaveValue('1');
    expect(selectOpacity).  toHaveValue('4');
    expect(strokeOpacity).  toHaveValue('7');
    expect(imageOpacity).   toHaveValue('10');
    expect(strokeWidth).    toHaveValue('13');
    expect(pointRadius).    toHaveValue('16');
    expect(pointImage).     toHaveValue(favicon);
    expect(minZoom).        toHaveValue('19');
    expect(maxZoom).        toHaveValue('22');
    expect(mapFocus).       toHaveValue('100,200');
    expect(mapZoom).        toHaveValue('10');

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
    expect(_t.vw.map.layers.length).toEqual(1);

    // Open form for Record 2.
    _t.click($(recordRows[1]));

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
    _t.click($(recordRows[0]));

    // Check for visible "Text."
    expect($('#record-form-text')).toHaveClass('active');

    // "Spatial" and "Style" should be invisible.
    expect($('#record-form-spatial')).not.toHaveClass('active');
    expect($('#record-form-style')).not.toHaveClass('active');

  });

  // it('should show form when a map feature is clicked', function() {

  //   // --------------------------------------------------------------------
  //   // When a vector geometry on the map is clicked and an edit form isn't
  //   // already open, the edit form that corresponds to the geometry should
  //   // be displayed in the left pane.
  //   // --------------------------------------------------------------------

  //   // Trigger click.
  //   _t.clickOnMapFeature(mapLayers[0], feature1);

  //   // Check for form.
  //   expect(_t.views.records.$el).toContain(_t.views.record.form);
  //   expect(_t.views.records.$el).not.toContain(_t.views.records.ul);
  //   expect(_t.views.record.model.get('title')).toEqual('title1');

  // });

  // it('should not open new form in response to map click', function() {

  //   // --------------------------------------------------------------------
  //   // When an edit form is already open, clicking on a map feature that
  //   // corresponds to a different model from the one bound to the form
  //   // should _not_ open the new form. This makes it impossible to
  //   // accidentally switch to another edit form by clicking on a feature
  //   // that belongs to a different record while drawing shapes in close
  //   // proximity to other vectors.
  //   // --------------------------------------------------------------------

  //   // Trigger click on Record 1 feature.
  //   _t.clickOnMapFeature(mapLayers[0], feature1);

  //   // Check for form.
  //   expect(_t.views.records.$el).toContain(_t.views.record.form);
  //   expect(_t.views.records.$el).not.toContain(_t.views.records.ul);
  //   expect(_t.views.record.model.get('title')).toEqual('title1');

  //   // Trigger click on Record 2 feature.
  //   _t.clickOnMapFeature(mapLayers[0], feature2);

  //   // Check for unchanged form.
  //   expect(_t.views.record.model.get('title')).toEqual('title1');

  // });

  // it('should focus map when the form is opened via editor', function() {

  //   // --------------------------------------------------------------------
  //   // When an edit form is opened by way of the records pane (when the
  //   // user clicks on one of the listings), the map should focus on the
  //   // geometry vectors for that record.
  //   // --------------------------------------------------------------------

  //   // Set center and zoom.
  //   _t.setMapCenter(200, 300, 15);

  //   // Click on record listing.
  //   $(recordRows[0]).trigger('click');

  //   // Get focus and zoom.
  //   var center = _t.mapView.map.getCenter();
  //   var zoom = _t.mapView.map.getZoom();

  //   // Check unchanged focus.
  //   expect(center.lon).toEqual(100);
  //   expect(center.lat).toEqual(200);
  //   expect(zoom).toEqual(10);

  // });

  // it('should not focus map when the form is opened via map', function() {

  //   // --------------------------------------------------------------------
  //   // When the user clicks on a map vector to open an edit form, the map
  //   // should _not_ jump to the default focus position for the record that
  //   // corresponds to the clicked geometry. This to prevent lurching,
  //   // disorienting leaps that can occur when the default zoom for the
  //   // clicked record is much wider or tighter than the current map zoom.
  //   // --------------------------------------------------------------------

  //   // Set center and zoom.
  //   _t.setMapCenter(200, 300, 15);

  //   // Trigger click on Record 1 feature.
  //   _t.clickOnMapFeature(mapLayers[0], feature1);

  //   // Get focus and zoom.
  //   var center = _t.mapView.map.getCenter();
  //   var zoom = _t.mapView.map.getZoom();

  //   // Check unchanged focus.
  //   expect(center.lon).toEqual(200);
  //   expect(center.lat).toEqual(300);
  //   expect(zoom).toEqual(15);

  // });

  // it('should freeze edit layer when form opened via editor', function() {

  //   // --------------------------------------------------------------------
  //   // When an edit form for a record is opened by clicking on the record
  //   // listing in the left pane, the record id should be added to the
  //   // `frozen` array on the map view. This prevents the layer for the
  //   // record from being remove, replaced, or changed when new map data is
  //   // ingested after a map move, which would have the effect of removing
  //   // the layer instance with the editing controls and clearing out
  //   // unsaved changes/additions to the geometry.
  //   // --------------------------------------------------------------------

  //   // By default, frozen empty.
  //   expect(_t.mapView.frozen).toEqual([]);

  //   // Show form, check `frozen`.
  //   $(recordRows[0]).trigger('click');
  //   expect(_t.mapView.frozen).toEqual([models[0].get('id')]);

  //   // Close, check `frozen` empty.
  //   _t.views.record.closeButton.trigger('click');
  //   expect(_t.mapView.frozen).toEqual([]);

  // });

  // it('should freeze edit layer when form opened via map', function() {

  //   // --------------------------------------------------------------------
  //   // When a form is opened by clicking on a map feature, the id of the
  //   // record should be added to the `frozen` array (see above).
  //   // --------------------------------------------------------------------

  //   // Trigger click on Record 1 feature.
  //   _t.clickOnMapFeature(mapLayers[0], feature1);

  //   // Check `frozen`.
  //   expect(_t.mapView.frozen).toEqual([models[0].get('id')]);

  //   // Close, check `frozen` empty.
  //   _t.views.record.closeButton.trigger('click');
  //   expect(_t.mapView.frozen).toEqual([]);

  // });

  // it('should default to "Navigate" edit mode when opened', function() {

  //   // --------------------------------------------------------------------
  //   // The "Edit Geometry" controls should always revert to the default
  //   // "Navigate" mode when a form is opened, regardless of what the state
  //   // of the form was when it was last closed.
  //   // --------------------------------------------------------------------

  //   // Show form, check mode.
  //   $(recordRows[0]).trigger('click');
  //   expect(_t.spatialTabView.getMapControl()).toEqual('pan');

  //   // Activate "Polygon" control, check mode.
  //   $('input[name="editMode"]')[0].checked = false;
  //   $('input[name="editMode"]')[3].checked = true;
  //   expect(_t.spatialTabView.getMapControl()).toEqual('poly');

  //   // Close the form, re-get records.
  //   _t.views.record.closeButton.trigger('click');
  //   recordRows = _t.views.records.$el.find('.record-row');

  //   // Open new form, check mode.
  //   $(recordRows[1]).trigger('click');
  //   expect(_t.spatialTabView.getMapControl()).toEqual('pan');

  // });

});
