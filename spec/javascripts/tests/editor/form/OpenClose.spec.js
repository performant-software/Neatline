
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Test for form open and close.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Form Open/Close', function() {

  var server, records, layers, feature1, feature2;
  var json = readFixtures('records.json');

  // Get fixtures.
  beforeEach(function() {

    // Load partial, mock server.
    loadFixtures('editor-partial.html');
    server = sinon.fakeServer.create();

    // Run Editor.
    _t.loadEditor();

    // Intercept requests.
    _.each(server.requests, function(r) {
      _t.respond200(r, json);
    });

    // Get record listings.
    records = _t.records.$el.find('.record-row');

    // Get layers and features.
    layers = _t.getVectorLayers();
    feature1 = layers[0].features[0];
    feature2 = layers[1].features[0];

  });

  it('should open the form when a record row is clicked', function() {
    $(records[0]).trigger('click');
    expect(_t.records.$el).toContain(_t.form.form);
    expect(_t.records.$el).not.toContain(_t.records.ul);
  });

  it('should close the form when "Close" is clicked', function() {
    $(records[0]).trigger('click');
    $(_t.form.closeButton).trigger('click');
    expect(_t.records.$el).not.toContain(_t.form.form);
    expect(_t.records.$el).toContain(_t.records.ul);
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
    _t.map.map.events.triggerEvent('click', evt);

    // Check for form.
    expect(_t.records.$el).toContain(_t.form.form);
    expect(_t.records.$el).not.toContain(_t.records.ul);
    expect(_t.form.model.get('title')).toEqual('Record 1');

  });

  it('should not change form records in response to map click', function() {

    // Mock feature1 click.
    layers[0].getFeatureFromEvent = function(evt) { return feature1; };

    // Mock cursor event.
    var evt = {
      xy: new OpenLayers.Pixel(Math.random(), Math.random()),
      type: 'click'
    };

    // Trigger click.
    _t.map.map.events.triggerEvent('click', evt);

    // Check for form.
    expect(_t.records.$el).toContain(_t.form.form);
    expect(_t.records.$el).not.toContain(_t.records.ul);
    expect(_t.form.model.get('title')).toEqual('Record 1');

    // Mock feature2 click.
    layers[0].getFeatureFromEvent = function(evt) { return feature2; };

    // Trigger click.
    _t.map.map.events.triggerEvent('click', evt);

    // Check for unchanged.
    expect(_t.form.model.get('title')).toEqual('Record 1');

  });

  it('should freeze the form model on the map on form open', function() {

    // Get Record 1 layer.
    var layers = _t.getVectorLayers();
    var record1Layer = _.find(layers, function(layer) {
      return layer.name == 'Record 1';
    });

    // By default, no frozen layers.
    expect(_t.map.frozen).toEqual([]);

    // Open form, check for frozen.
    $(records[0]).trigger('click');
    expect(_t.map.frozen).toEqual([record1Layer.nId]);

  });

});
