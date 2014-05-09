
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = {

  options: {
    'include css': true,
    paths: ['<%= paths.src.styl.shared %>', 'bower_components'],
    import: ['var']
  },

  neatline_public: {
    src: '<%= paths.src.styl.shared %>/public.styl',
    dest: '<%= paths.dist.css.shared %>/neatline-public.css'
  },

  neatline_editor: {
    src: '<%= paths.src.styl.shared %>/editor.styl',
    dest: '<%= paths.dist.css.shared %>/neatline-editor.css'
  },

  exhibit_form: {
    src: '<%= paths.src.styl.admin %>/exhibit-form.styl',
    dest: '<%= paths.dist.css.admin %>/exhibit-form.css'
  }

};
