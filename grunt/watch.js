
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = {

  options: {
    livereload: true
  },

  payload: {
    files: [
      'views/**/*.js',
      'views/**/*.styl',
      'views/**/*.php',
      '!views/**/dist/**',
      'tests/**/*.js',
      '!tests/**/dist/**'
    ],
    tasks: 'compile'
  }

};
