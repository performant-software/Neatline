
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = {

  options: {
    template: 'docs/template.html',
  },

  docs: {
    src: 'docs/markdown/*.md',
    dest: 'docs/html/',
    ext: '.html',
    flatten: true,
    expand: true
  }

};
