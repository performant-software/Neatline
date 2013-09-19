
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

jQuery(function($) {

  // Instantiate Chosen on layers and widgets selects.

  $('.chosen').chosen();

  // Instantiate CKEditor on the "Narrative" field.

  CKEDITOR.replace('narrative', {
    allowedContent: true,
    toolbar: [
      ['Maximize', 'Source'],
      ['Bold', 'Italic', 'Underline', 'RemoveFormat'],
      ['Link', 'Unlink', 'Image', 'Iframe'],
      ['Styles', 'Format', 'Font', 'FontSize'],
      ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
      ['NumberedList', 'BulletedList'],
      ['Outdent', 'Indent'],
      ['Blockquote', 'CreateDiv'],
    ]
  });

});
