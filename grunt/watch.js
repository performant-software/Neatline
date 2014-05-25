
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
      '<%= concat.addForm.src %>',
      '<%= concat.editForm.src %>',
      '<%= concat.neatlinePublic.src %>',
      '<%= concat.neatlineEditor.src %>',
      '<%= concat.jasmineVendor.src %>',
      '<%= stylus.neatlinePublic.src %>',
      '<%= stylus.neatlineEditor.src %>',
      '<%= stylus.exhibitForm.src %>',
    ],
    tasks: 'compile'
  }

};
