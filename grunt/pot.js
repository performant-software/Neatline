
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = {

  options: {
    text_domain: 'Neatline',
    dest: 'languages/',
    overwrite: true,
    encoding: 'UTF-8',
    language: 'PHP',
    keywords: ['__'],
    omit_header: true
  },

  files: {
    src: [
      '**/*.php',
      '!bower_components/**',
      '!node_modules/**'
    ],
    expand: true
  }

};
