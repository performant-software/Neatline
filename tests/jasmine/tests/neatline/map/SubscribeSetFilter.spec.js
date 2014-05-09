
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Subscribe `setFilter`', function() {


  var fixtures = {
    regular: readFixtures('NeatlineMapSubscribeSetFilter.regular.json'),
    deleted: readFixtures('NeatlineMapSubscribeSetFilter.deleted.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should set filters', function() {

    // ------------------------------------------------------------------------
    // `setFilter` should register the passed evaluator function and re-filter
    // all vector and WMS layers on the map.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.regular);

    // By default, all layers visible.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeTruthy();

    // Filter out records with `title1`.
    Neatline.vent.trigger('setFilter', {
      key: 'title1',
      evaluator: function(record) {
        return record.get('title') != 'title1';
      }
    });

    // Record 1 should be hidden.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeTruthy();

    // Filter out records with `title2`.
    Neatline.vent.trigger('setFilter', {
      key: 'title2',
      evaluator: function(record) {
        return record.get('title') != 'title2';
      }
    });

    // Records 1 and 2 should be hidden.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeTruthy();

    // Filter out records with `title3`.
    Neatline.vent.trigger('setFilter', {
      key: 'title3',
      evaluator: function(record) {
        return record.get('title') != 'title3';
      }
    });

    // Record 1, 2, and 3 should be hidden.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeFalsy();

  });


  it('should filter new layers', function() {

    // ------------------------------------------------------------------------
    // When new vector and WMS layers are created, they should be run through
    // the filtering system before being added to the map.
    // ------------------------------------------------------------------------

    // Load collection without record 3.
    NL.respondMap200(fixtures.deleted);

    // Filter out `title3`.
    Neatline.vent.trigger('setFilter', {
      key: 'title3',
      evaluator: function(record) {
        return record.get('title') != 'title3';
      }
    });

    // Load collection with record 3.
    NL.refreshMap(fixtures.regular);

    // Records 3 should be hidden.
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeFalsy();

  });


});
