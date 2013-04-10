
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

      StaticBubble: {
        records:    readFixtures('StaticBubble.records.json')
      }

    };

  };


  return _t;


})(_t || {});
