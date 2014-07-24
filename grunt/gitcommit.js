
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = {

  options: {
    ignoreEmpty: true
  },

  release: {
    options: {
      message: 'Version <%= pkg.version %>.'
    },
    files: {
      src: '.'
    }
  },

  static: {
    options: {
      message: 'Committing static assets.'
    },
    files: {
      src: '.'
    }
  }

};
