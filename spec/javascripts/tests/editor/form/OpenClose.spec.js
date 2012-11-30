
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

  // Load AJAX fixtures.
  var noRecord2Json = readFixtures('records-removed-record.json');

  // Get fixtures.
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
    $(_t.formView.closeButton).trigger('click');

    // Check for records list, no form.
    expect(_t.recordsView.$el).not.toContain(_t.formView.form);
    expect(_t.recordsView.$el).toContain(_t.recordsView.ul);

    // 3 records in browser pane.
    recordRows = _t.getRecordRows();
    expect(recordRows.length).toEqual(3);
    expect($(recordRows[0]).text()).toEqual('Record 1');
    expect($(recordRows[1]).text()).toEqual('Record 2');
    expect($(recordRows[2]).text()).toEqual('Record 3');

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
    _t.refreshMap(noRecord2Json);

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

    // Open form.
    $(recordRows[0]).trigger('click');

    // Check for visible "Text."
    expect($('#form-text')).toHaveClass('active');

    // Invisible "Spatial" and "Style."
    expect($('#form-spatial')).not.toHaveClass('active');
    expect($('#form-style')).not.toHaveClass('active');

  });

  it('should show form when a map feature is clicked', function() {

    // Clobber getFeaturesFromEvent().
    mapLayers[0].getFeatureFromEvent = function(evt) { return feature1; };

    // Mock cursor event.
    var evt = {
      xy: new OpenLayers.Pixel(Math.random(), Math.random()),
      type: 'click'
    };

    // Trigger click.
    _t.mapView.map.events.triggerEvent('click', evt);

    // Check for form.
    expect(_t.recordsView.$el).toContain(_t.formView.form);
    expect(_t.recordsView.$el).not.toContain(_t.recordsView.ul);
    expect(_t.formView.model.get('title')).toEqual('Record 1');

  });

  it('should not open new form in response to map click', function() {

    // Mock feature1 click.
    mapLayers[0].getFeatureFromEvent = function(evt) { return feature1; };

    // Mock cursor event.
    var evt = {
      xy: new OpenLayers.Pixel(Math.random(), Math.random()),
      type: 'click'
    };

    // Trigger click.
    _t.mapView.map.events.triggerEvent('click', evt);

    // Check for form.
    expect(_t.recordsView.$el).toContain(_t.formView.form);
    expect(_t.recordsView.$el).not.toContain(_t.recordsView.ul);
    expect(_t.formView.model.get('title')).toEqual('Record 1');

    // Mock feature2 click.
    mapLayers[0].getFeatureFromEvent = function(evt) { return feature2; };

    // Trigger click.
    _t.mapView.map.events.triggerEvent('click', evt);

    // Check for unchanged.
    expect(_t.formView.model.get('title')).toEqual('Record 1');

  });

  it('should focus the map when the form is opened via editor', function() {

    // Set center and zoom.
    var lonlat = new OpenLayers.LonLat(200, 300);
    _t.mapView.map.setCenter(lonlat, 15);

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

  it('should not focus the map when the form is opened via map', function() {

    // Set center and zoom.
    var lonlat = new OpenLayers.LonLat(200, 300);
    _t.mapView.map.setCenter(lonlat, 15);

    // Mock feature1 click.
    mapLayers[0].getFeatureFromEvent = function(evt) { return feature1; };

    // Mock cursor event.
    var evt = {
      xy: new OpenLayers.Pixel(Math.random(), Math.random()),
      type: 'click'
    };

    // Trigger click.
    _t.mapView.map.events.triggerEvent('click', evt);

    // Get focus and zoom.
    var center = _t.mapView.map.getCenter();
    var zoom = _t.mapView.map.getZoom();

    // Check unchanged focus.
    expect(center.lon).toEqual(200);
    expect(center.lat).toEqual(300);
    expect(zoom).toEqual(15);

  });

  it('should freeze edit layer when form opened via editor', function() {

    // By default, frozen empty.
    expect(_t.mapView.frozen).toEqual([]);

    // Show form, check frozen.
    $(recordRows[0]).trigger('click');
    expect(_t.mapView.frozen).toEqual([models[0].get('id')]);

    // Close, check frozen.
    $(_t.formView.closeButton).trigger('click');
    expect(_t.mapView.frozen).toEqual([]);

  });

  it('should freeze edit layer when form opened via map', function() {

    // Clobber getFeaturesFromEvent().
    mapLayers[0].getFeatureFromEvent = function(evt) { return feature1; };

    // Mock cursor event.
    var evt = {
      xy: new OpenLayers.Pixel(Math.random(), Math.random()),
      type: 'click'
    };

    // By default, frozen empty.
    expect(_t.mapView.frozen).toEqual([]);

    // Show form, check frozen.
    _t.mapView.map.events.triggerEvent('click', evt);
    expect(_t.mapView.frozen).toEqual([models[0].get('id')]);

    // Close, check frozen.
    $(_t.formView.closeButton).trigger('click');
    expect(_t.mapView.frozen).toEqual([]);

  });

  it('should default to "Navigate" mode on open', function() {

    // Show form, check mode.
    $(recordRows[0]).trigger('click');
    expect(_t.formView.getMapControl()).toEqual('pan');

    // Activate "Polygon" control, check mode.
    $('input[name="mapControls"]')[3].checked = true;
    expect(_t.formView.getMapControl()).toEqual('poly');

    // Close the form, re-get records.
    $(_t.formView.closeButton).trigger('click');
    recordRows = _t.recordsView.$el.find('.record-row');

    // Open new form, check mode.
    $(recordRows[1]).trigger('click');
    expect(_t.formView.getMapControl()).toEqual('pan');

  });

});
