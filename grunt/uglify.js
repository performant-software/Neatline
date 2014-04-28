
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80: */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = {

  options: {
    beautify: {
      quote_keys: true // Fixes Select2 breakage in PhantomJS.
    }
  },

  add_form: {
    src: '<%= concat.add_form.dest %>',
    dest: '<%= concat.add_form.dest %>'
  },

  edit_form: {
    src: '<%= concat.edit_form.dest %>',
    dest: '<%= concat.edit_form.dest %>'
  },

  neatline_public: {
    src: '<%= concat.neatline_public.dest %>',
    dest: '<%= concat.neatline_public.dest %>'
  },

  neatline_editor: {
    src: '<%= concat.neatline_editor.dest %>',
    dest: '<%= concat.neatline_editor.dest %>'
  }

};
