
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = {

  admin: {
    src: '*.css',
    cwd: '<%= paths.dist.css.admin %>',
    dest: '<%= paths.dist.css.admin %>',
    expand: true
  },

  shared: {
    src: '*.css',
    dest: '<%= paths.dist.css.shared %>',
    cwd: '<%= paths.dist.css.shared %>',
    expand: true
  }

};
