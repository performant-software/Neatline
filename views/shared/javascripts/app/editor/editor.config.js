
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor configuration.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


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
 * If a record/tag title is null, apply a placeholder string.
 *
 * @param {Mixed} title: The title.
 * @return {String}: The placeholder, if the title is null .
 */
rivets.formatters.title = function(title) {
  return title ? title : STRINGS.placeholders.title;
};
