
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = {

  options: {
    template: '<%= paths.jasmine %>/runner.tmpl',
    helpers: '<%= paths.jasmine %>/dist/vendor.js'
  },

  neatline: {
    src: '<%= paths.dist.js.shared %>/neatline-public.js',
    options: {
      specs: '<%= paths.jasmine %>/tests/neatline/**/*.spec.js'
    }
  },

  editor: {
    src: [
      '<%= paths.dist.js.shared %>/ckeditor/ckeditor.js',
      '<%= paths.dist.js.shared %>/neatline-editor.js'
    ],
    options: {
      specs: '<%= paths.jasmine %>/tests/editor/**/*.spec.js'
    }
  }

};
