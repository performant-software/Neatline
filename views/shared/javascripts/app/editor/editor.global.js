
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
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
 * If a record/tag title is null, inject a placeholder string.
 *
 * @param {String|null} title: The title.
 * @return {String}: If the title is null, return the placeholder.
 */
rivets.formatters.recordTitle = function(title) {
  return title ? _.string.stripTags(title) :
    STRINGS.record.placeholders.title;
};


/**
 * If the passed id is non-null, return format '#<id>:'.
 *
 * @param {Number|null} id: The record id.
 * @return {String}: The formatted id.
 */
rivets.formatters.recordId = function(id) {
  return id ? '#'+id+':' : null;
};


/**
 * Explode a comma-delimited string to an array.
 *
 * @param {String} string: A comma-delimited string.
 * @return {Array}: The exploded array.
 */
rivets.formatters.commaDelimited = {

  read: function(value) {
    if (_.isString(value)) return value.split(',');
    else if (_.isNull(value)) return [];
  },

  publish: function(value) {
    if (_.isArray(value)) value = value.join();
    return value;
  }

};


/**
 * Toastr globals.
 */
toastr.options = {
  timeOut:  2500,
  fadeIn:   200,
  fadeOut:  200
};
