
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

  var records, layers, models, feature1, feature2;

  // Load AJAX fixtures.
  var jsonRemovedData = readFixtures('records-removed-record.json');

  // Get fixtures.
  beforeEach(function() {

    _t.loadEditor();

    // Get record listings.
    records = _t.recordsView.$el.find('.record-row');

    // Get layers and features.
    layers = _t.getVectorLayers();
    feature1 = layers[0].features[0];
    feature2 = layers[1].features[0];

    // Get models.
    models = Editor.Modules.Records.collection.models;

  });

  it('should open the form when a record row is clicked', function() {

    // Click on record listing.
    $(records[0]).trigger('click');

    // Check for form, no records.
    expect(_t.recordsView.$el).toContain(_t.formView.form);
    expect(_t.recordsView.$el).not.toContain(_t.recordsView.ul);

  });

  it('should close the form when "Close" is clicked', function() {

    // Open form, click close.
    $(records[0]).trigger('click');
    $(_t.formView.closeButton).trigger('click');

    // Check for records, no form.
    expect(_t.recordsView.$el).not.toContain(_t.formView.form);
    expect(_t.recordsView.$el).toContain(_t.recordsView.ul);

  });

  it('should create map edit layer when one does not exist', function() {

    // Load map data with missing record2.
    _t.mapView.map.events.triggerEvent('moveend');
    var request = _.last(_t.server.requests);
    _t.respond200(request, jsonRemovedData);

    // Check starting layers.
    expect(_t.mapView.layers.length).toEqual(1);

    // Open record without map layer.
    $(records[1]).trigger('click');

    // Check for new layer.
    layers = _t.getVectorLayers();
    expect(_t.mapView.layers.length).toEqual(2);
    expect(layers[1].features[0].geometry.x).toEqual(3);
    expect(layers[1].features[0].geometry.y).toEqual(4);

  });

  it('should show the "Text" tab on first form open', function() {

    // Open form.
    $(records[0]).trigger('click');

    // Check for visible "Text."
    expect($('#form-text')).toHaveClass('active');

    // Invisible "Spatial" and "Style."
    expect($('#form-spatial')).not.toHaveClass('active');
    expect($('#form-style')).not.toHaveClass('active');

  });

  it('should show form when a map feature is clicked', function() {

    // Clobber getFeaturesFromEvent().
    layers[0].getFeatureFromEvent = function(evt) { return feature1; };

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
    layers[0].getFeatureFromEvent = function(evt) { return feature1; };

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
    layers[0].getFeatureFromEvent = function(evt) { return feature2; };

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
    $(records[0]).trigger('click');

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
    layers[0].getFeatureFromEvent = function(evt) { return feature1; };

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
    $(records[0]).trigger('click');
    expect(_t.mapView.frozen).toEqual([models[0].get('id')]);

    // Close, check frozen.
    $(_t.formView.closeButton).trigger('click');
    expect(_t.mapView.frozen).toEqual([]);

  });

  it('should freeze edit layer when form opened via map', function() {

    // Clobber getFeaturesFromEvent().
    layers[0].getFeatureFromEvent = function(evt) { return feature1; };

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
    $(records[0]).trigger('click');
    expect(_t.formView.getMapControl()).toEqual('pan');

    // Activate "Polygon" control, check mode.
    $('input[name="mapControls"]')[3].checked = true;
    expect(_t.formView.getMapControl()).toEqual('poly');

    // Close the form, re-get records.
    $(_t.formView.closeButton).trigger('click');
    records = _t.recordsView.$el.find('.record-row');

    // Open new form, check mode.
    $(records[1]).trigger('click');
    expect(_t.formView.getMapControl()).toEqual('pan');

  });

});
