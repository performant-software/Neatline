
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor globals.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Global ajax loading notification.
 */
$(function() {
  $('#loader').
    ajaxStart(function() {
      $(this).show();
    }).
    ajaxStop(function() {
      $(this).hide();
    })
  ;
});


/**
 * Toastr globals.
 */
toastr.options = {
  timeOut:  2500,
  fadeIn:   200,
  fadeOut:  200
};


/**
 * Construct the URL fragment for a record edit form.
 *
 * @param {Number} id: The record id.
 * @return {String}: The URL fragment.
 */
rivets.formatters.recordLink = function(id) {
  return '#records/'+id;
};


/**
 * If a record/tag title is null, inject a placeholder string.
 *
 * @param {String|null} title: The title.
 * @return {String}: If the title is null, return the placeholder.
 */
rivets.formatters.title = function(title) {
  return title ? title : STRINGS.placeholders.title;
};


/**
 * If the passed id is non-null, return format '#<id>:'.
 *
 * @param {Number|null} id: The record id.
 * @return {String}: The formatted id.
 */
rivets.formatters.id = function(id) {
  return id ? '#'+id+':' : null;
};
