
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Subscribe `removeFilter`', function() {


  var fixtures = {
    records: readFixtures('NeatlineMapSubscribeRemoveFilter.json')
  };


  beforeEach(function() {
    NL.loadNeatline();
  });


  it('should remove filters', function() {

    // ------------------------------------------------------------------------
    // `removeFilter` should remove the evaluator function identified by the
    // passed key and re-filter all vector and WMS layers on the map.
    // ------------------------------------------------------------------------

    NL.respondMap200(fixtures.records);

    // Filter out records with `title1`, `title2`, `title3`.

    Neatline.vent.trigger('setFilter', {
      key: 'title1',
      evaluator: function(record) {
        return record.get('title') != 'title1';
      }
    });

    Neatline.vent.trigger('setFilter', {
      key: 'title2',
      evaluator: function(record) {
        return record.get('title') != 'title2';
      }
    });

    Neatline.vent.trigger('setFilter', {
      key: 'title3',
      evaluator: function(record) {
        return record.get('title') != 'title3';
      }
    });

    // At start, records 1, 2, and 3 should be hidden.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeFalsy();

    // Remove `title1` filter.
    Neatline.vent.trigger('removeFilter', { key: 'title1' });

    // Record 1 should be visible.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeFalsy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeFalsy();

    // Remove `title2` filter.
    Neatline.vent.trigger('removeFilter', { key: 'title2' });

    // Records 1 and 2 should be visible.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeFalsy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeFalsy();

    // Remove `title3` filter.
    Neatline.vent.trigger('removeFilter', { key: 'title3' });

    // Records 1, 2, and 3 should be visible.
    expect(NL.getVectorLayer('title1'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title2'). getVisibility()).toBeTruthy();
    expect(NL.getVectorLayer('title3'). getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title1').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title2').    getVisibility()).toBeTruthy();
    expect(NL.getWmsLayer('title3').    getVisibility()).toBeTruthy();

  });


});
