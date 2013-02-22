
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

      records: {
        standard: readFixtures('records.standard.json'),
        changed:  readFixtures('records.changed.json'),
        removed:  readFixtures('records.removed.json'),
        noTitle:  readFixtures('records.noTitle.json'),
        tags:     readFixtures('records.tags.json'),
        p12:      readFixtures('records.p12.json'),
        p23:      readFixtures('records.p23.json'),
        p34:      readFixtures('records.p34.json'),
        p56:      readFixtures('records.p56.json'),
        p6:       readFixtures('records.p6.json')
      },

      record: {
        standard: readFixtures('record.standard.json'),
        add:      readFixtures('record.add.json')
      }

    };
  };


  return _t;


})(_t || {});
