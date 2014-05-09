
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

jQuery(function($) {

  // Auto-generate the URL slug based on the value of the "Title" field.

  var title = $('input[name="title"]');
  var slug  = $('input[name="slug"]');

  var typed = false;
  slug.change(function() { typed = true; });

  title.keyup(function() {
    if (!typed) slug.val(_.string.slugify(title.val()));
  });

});
