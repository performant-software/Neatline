
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

jQuery(function($) {

  $('.chosen').chosen();

  var title = $('input[name="title"]');
  var slug  = $('input[name="slug"]');

  var hasTyped = false;

  slug.change(function() {
    hasTyped = true;
  });

  title.keyup(function() {
    if (!hasTyped) slug.val(_.string.slugify(title.val()));
  });

});
