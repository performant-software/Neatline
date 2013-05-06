
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Show load spinner during ajax requests.
 */
$(function() {
  $('#loader').hide().

    ajaxStart(function() {
      $(this).show();
    }).

    ajaxStop(function() {
      $(this).hide();
    })

  ;
});
