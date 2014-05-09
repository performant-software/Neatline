
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = {

  dist: [
    '<%= paths.dist.js.shared %>',
    '<%= paths.dist.css.shared %>',
    '<%= paths.dist.js.admin %>',
    '<%= paths.dist.css.admin %>'
  ],

  fixtures: [
    '<%= paths.jasmine %>/fixtures/*.json',
    '<%= paths.jasmine %>/fixtures/*.html',
    '<%= paths.jasmine %>/fixtures/*.xml'
  ],

  bower:  'bower_components',
  fonts:  'views/shared/css/fonts',
  images: 'views/shared/images',
  dist:   'pkg'

};
