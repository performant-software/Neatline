
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Layer Filtering', function() {


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should set filters', function() {

    // --------------------------------------------------------------------
    // `setFilter` should register the passed evaluator function and re-
    // filter all vector and WMS layers on the map.
    // --------------------------------------------------------------------

    NL.respondMap200(NL.json.MapLayerFiltering.records.regular);

    // By default, all layers visible.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeTruthy();

    // Filter out records with title `title1`.
    Neatline.vent.trigger('setFilter', 'title1', function(record) {
      return record.get('title') != 'title1';
    });

    // Record 1 should be hidden.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeTruthy();

    // Filter out records with title `title2`.
    Neatline.vent.trigger('setFilter', 'title2', function(record) {
      return record.get('title') != 'title2';
    });

    // Records 1 and 2 should be hidden.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeTruthy();

    // Filter out records with title `title3`.
    Neatline.vent.trigger('setFilter', 'title3', function(record) {
      return record.get('title') != 'title3';
    });

    // Record 1, 2, and 3 should be hidden.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeFalsy();

  });


  it('should remove filters', function() {

    // --------------------------------------------------------------------
    // `removeFilter` should remove evaluator function identified by the
    // passed key and re-filter all vector and WMS layers on the map.
    // --------------------------------------------------------------------

    NL.respondMap200(NL.json.MapLayerFiltering.records.regular);

    // Filter out records with `title1`, `title2`, `title3`.
    Neatline.vent.trigger('setFilter', 'title1', function(record) {
      return record.get('title') != 'title1';
    });
    Neatline.vent.trigger('setFilter', 'title2', function(record) {
      return record.get('title') != 'title2';
    });
    Neatline.vent.trigger('setFilter', 'title3', function(record) {
      return record.get('title') != 'title3';
    });

    // At start, records 1, 2, and 3 should be hidden.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeFalsy();

    // Remove `title1` filter.
    Neatline.vent.trigger('removeFilter', 'title1');

    // Record 1 should be visible.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeFalsy();

    // Remove `title2` filter.
    Neatline.vent.trigger('removeFilter', 'title2');

    // Records 1 and 2 should be visible.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeFalsy();

    // Remove `title3` filter.
    Neatline.vent.trigger('removeFilter', 'title3');

    // Records 1, 2, and 3 should be visible.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeTruthy();

  });


  it('should filter new layers', function() {

    // --------------------------------------------------------------------
    // When new vector and WMS layers are created, they should be passed
    // through the filtering system before being added to the map.
    // --------------------------------------------------------------------

    NL.respondMap200(NL.json.MapLayerFiltering.records.deleted);

    // Filter out `title3`.
    Neatline.vent.trigger('setFilter', 'title3', function(record) {
      return record.get('title') != 'title3';
    });

    // Load collection with record 3.
    NL.refreshMap(NL.json.MapLayerFiltering.records.regular);

    // Records 3 should be hidden.
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeFalsy();

  });


});
