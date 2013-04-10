
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Fixture loading helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var _t = (function(_t) {


  /**
   * Set the fixtures path.
   */
  _t.setFixturesPath = function() {
    jasmine.getFixtures().fixturesPath = 'tests/jasmine/fixtures';
    jasmine.getStyleFixtures().fixturesPath = 'views/shared/css/payloads';
  };


  /**
   * Read JSON fixtures.
   */
  _t.loadJsonFixtures = function() {

    this.json = {

      MapCursorEvents: {
        records:    readFixtures('MapCursorEvents.records.json')
      },

      MapRecordFocusing: {
        records:    readFixtures('MapRecordFocusing.records.json'),
        record:     readFixtures('MapRecordFocusing.record.json')
      },

      MapVectorLayers: {
        records: {
          regular:  readFixtures('MapVectorLayers.records.regular.json'),
          deleted:  readFixtures('MapVectorLayers.records.deleted.json'),
          styles:   readFixtures('MapVectorLayers.records.styles.json')
        }
      },



      // OLD

      exhibit:        readFixtures('exhibit.json'),

      records: {
        standard:     readFixtures('records.standard.json'),
        list:         readFixtures('records.list.json'),
        vector: {
          standard:   readFixtures('records.vector.standard.json'),
          changed:    readFixtures('records.vector.changed.json'),
        },
        pagination: {
          r1_2:       readFixtures('records.pagination.1-2.json'),
          r2_3:       readFixtures('records.pagination.2-3.json'),
          r3_4:       readFixtures('records.pagination.3-4.json'),
          r5_6:       readFixtures('records.pagination.5-6.json'),
          r6:         readFixtures('records.pagination.6.json')
        }
      },

      record: {
        standard:     readFixtures('record.standard.json'),
        add:          readFixtures('record.add.json')
      }

    };

    this.xml = {
      items:          readFixtures('items.xml')
    };

  };


  return _t;


})(_t || {});
