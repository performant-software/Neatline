
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Fixture loading helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Read HTML fixtures.
 *
 * @param {String} html: The name of the HTML fixture.
 * @param {String} css: The name of the css fixture.
 */
_t.loadFixtures = function(html, css) {
  this.setFixturesPath();
  this.loadJsonFixtures();
  loadFixtures(html);
  loadStyleFixtures(css);
};


/**
 * Set the fixtures path.
 */
_t.setFixturesPath = function() {
  jasmine.getFixtures().fixturesPath = 'fixtures';
  jasmine.getStyleFixtures().fixturesPath = 'payloads/css';
};


/**
 * Read JSON fixtures.
 */
_t.loadJsonFixtures = function() {
  this.json = {

    records: {
      standard: readFixtures('records.standard.json'),
      changed:  readFixtures('records.changed.json'),
      removed:  readFixtures('records.removed.json')
    },

    record: {
      standard: readFixtures('record.standard.json'),
      inactive: readFixtures('record.inactive.json'),
      add:      readFixtures('record.add.json')
    },

    tags: {
      standard: readFixtures('tags.standard.json')
    }

    // tag: {
      // standard: readFixtures('tag.standard.json')
    // }

  };
};
