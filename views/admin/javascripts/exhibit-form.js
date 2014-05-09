
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

jQuery(function($) {

  // Instantiate Chosen on layers and widgets selects.

  $('.chosen').chosen();

  // Instantiate CKEditor on the "Narrative" field.

  CKEDITOR.replace('narrative', {
    allowedContent: true
  });

});
