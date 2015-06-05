
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = {

  options: {
    beautify: {
      quote_keys: true // Fixes Select2 breakage in PhantomJS.
    }
  },

  addForm: {
    src: '<%= concat.addForm.src %>',
    dest: '<%= concat.addForm.dest %>'
  },

  editForm: {
    src: '<%= concat.editForm.src %>',
    dest: '<%= concat.editForm.dest %>'
  },

  neatlinePublic: {
    src: '<%= concat.neatlinePublic.src %>',
    dest: '<%= concat.neatlinePublic.dest %>'
  },

  neatlineEditor: {
    src: '<%= concat.neatlineEditor.src %>',
    dest: '<%= concat.neatlineEditor.dest %>'
  },

  jasmineVendor: {
    src: '<%= concat.jasmineVendor.src %>',
    dest: '<%= concat.jasmineVendor.dest %>'
  }

};
