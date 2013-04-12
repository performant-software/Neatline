
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for map layer filtering.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Layer Filter', function() {


  beforeEach(function() {
    _t.loadNeatline();
  });


  it('should set filters', function() {

    // --------------------------------------------------------------------
    // `MAP:setFilter` should register the passed evaluator function and
    // re-filter all vector and WMS layers on the map.
    // --------------------------------------------------------------------

    _t.respondMap200(_t.json.MapLayerFilter.records.regular);

    // By default, all layers visible.
    expect(_t.getVectorLayer('title1').getVisibility()).toBeTruthy();
    expect(_t.getVectorLayer('title2').getVisibility()).toBeTruthy();
    expect(_t.getVectorLayer('title3').getVisibility()).toBeTruthy();
    expect(_t.getWmsLayer('title1').getVisibility()).toBeTruthy();
    expect(_t.getWmsLayer('title2').getVisibility()).toBeTruthy();
    expect(_t.getWmsLayer('title3').getVisibility()).toBeTruthy();

    // Filter out records with title `title1`.
    Neatline.execute('MAP:setFilter', 'title1', function(layer) {
      return layer.nModel.get('title') != 'title1';
    });

    // Record 1 should be hidden.
    expect(_t.getVectorLayer('title1').getVisibility()).toBeFalsy();
    expect(_t.getVectorLayer('title2').getVisibility()).toBeTruthy();
    expect(_t.getVectorLayer('title3').getVisibility()).toBeTruthy();
    expect(_t.getWmsLayer('title1').getVisibility()).toBeFalsy();
    expect(_t.getWmsLayer('title2').getVisibility()).toBeTruthy();
    expect(_t.getWmsLayer('title3').getVisibility()).toBeTruthy();

    // Filter out records with title `title2`.
    Neatline.execute('MAP:setFilter', 'title2', function(layer) {
      return layer.nModel.get('title') != 'title2';
    });

    // Records 1 and 2 should be hidden.
    expect(_t.getVectorLayer('title1').getVisibility()).toBeFalsy();
    expect(_t.getVectorLayer('title2').getVisibility()).toBeFalsy();
    expect(_t.getVectorLayer('title3').getVisibility()).toBeTruthy();
    expect(_t.getWmsLayer('title1').getVisibility()).toBeFalsy();
    expect(_t.getWmsLayer('title2').getVisibility()).toBeFalsy();
    expect(_t.getWmsLayer('title3').getVisibility()).toBeTruthy();

    // Filter out records with title `title3`.
    Neatline.execute('MAP:setFilter', 'title3', function(layer) {
      return layer.nModel.get('title') != 'title3';
    });

    // Record 1, 2, and 3 should be hidden.
    expect(_t.getVectorLayer('title1').getVisibility()).toBeFalsy();
    expect(_t.getVectorLayer('title2').getVisibility()).toBeFalsy();
    expect(_t.getVectorLayer('title3').getVisibility()).toBeFalsy();
    expect(_t.getWmsLayer('title1').getVisibility()).toBeFalsy();
    expect(_t.getWmsLayer('title2').getVisibility()).toBeFalsy();
    expect(_t.getWmsLayer('title3').getVisibility()).toBeFalsy();

  });


  it('should remove filters', function() {

    // --------------------------------------------------------------------
    // `MAP:removeFilter` should remove evaluator function identified by
    // the passed key and re-filter all vector and WMS layers on the map.
    // --------------------------------------------------------------------

    _t.respondMap200(_t.json.MapLayerFilter.records.regular);

    // Filter out records with `title1`, `title2`, `title3`.
    Neatline.execute('MAP:setFilter', 'title1', function(layer) {
      return layer.nModel.get('title') != 'title1';
    });
    Neatline.execute('MAP:setFilter', 'title2', function(layer) {
      return layer.nModel.get('title') != 'title2';
    });
    Neatline.execute('MAP:setFilter', 'title3', function(layer) {
      return layer.nModel.get('title') != 'title3';
    });

    // At start, records 1, 2, and 3 should be hidden.
    expect(_t.getVectorLayer('title1').getVisibility()).toBeFalsy();
    expect(_t.getVectorLayer('title2').getVisibility()).toBeFalsy();
    expect(_t.getVectorLayer('title3').getVisibility()).toBeFalsy();
    expect(_t.getWmsLayer('title1').getVisibility()).toBeFalsy();
    expect(_t.getWmsLayer('title2').getVisibility()).toBeFalsy();
    expect(_t.getWmsLayer('title3').getVisibility()).toBeFalsy();

    // Remove `title1` filter.
    Neatline.execute('MAP:removeFilter', 'title1');

    // Record 1 should be visible.
    expect(_t.getVectorLayer('title1').getVisibility()).toBeTruthy();
    expect(_t.getVectorLayer('title2').getVisibility()).toBeFalsy();
    expect(_t.getVectorLayer('title3').getVisibility()).toBeFalsy();
    expect(_t.getWmsLayer('title1').getVisibility()).toBeTruthy();
    expect(_t.getWmsLayer('title2').getVisibility()).toBeFalsy();
    expect(_t.getWmsLayer('title3').getVisibility()).toBeFalsy();

    // Remove `title2` filter.
    Neatline.execute('MAP:removeFilter', 'title2');

    // Records 1 and 2 should be visible.
    expect(_t.getVectorLayer('title1').getVisibility()).toBeTruthy();
    expect(_t.getVectorLayer('title2').getVisibility()).toBeTruthy();
    expect(_t.getVectorLayer('title3').getVisibility()).toBeFalsy();
    expect(_t.getWmsLayer('title1').getVisibility()).toBeTruthy();
    expect(_t.getWmsLayer('title2').getVisibility()).toBeTruthy();
    expect(_t.getWmsLayer('title3').getVisibility()).toBeFalsy();

    // Remove `title3` filter.
    Neatline.execute('MAP:removeFilter', 'title3');

    // Records 1, 2, and 3 should be visible.
    expect(_t.getVectorLayer('title1').getVisibility()).toBeTruthy();
    expect(_t.getVectorLayer('title2').getVisibility()).toBeTruthy();
    expect(_t.getVectorLayer('title3').getVisibility()).toBeTruthy();
    expect(_t.getWmsLayer('title1').getVisibility()).toBeTruthy();
    expect(_t.getWmsLayer('title2').getVisibility()).toBeTruthy();
    expect(_t.getWmsLayer('title3').getVisibility()).toBeTruthy();

  });


  it('should filter new layers', function() {

    // --------------------------------------------------------------------
    // When new vector and WMS layers are created, they should be passed
    // through the filtering system before being added to the map.
    // --------------------------------------------------------------------

    _t.respondMap200(_t.json.MapLayerFilter.records.deleted);

    // Filter out `title3`.
    Neatline.execute('MAP:setFilter', 'title3', function(layer) {
      return layer.nModel.get('title') != 'title3';
    });

    // Load collection with record 3.
    _t.refreshMap(_t.json.MapLayerFilter.records.regular);

    // Records 3 should be hidden.
    expect(_t.getVectorLayer('title3').getVisibility()).toBeFalsy();
    expect(_t.getWmsLayer('title3').getVisibility()).toBeFalsy();

  });


});
