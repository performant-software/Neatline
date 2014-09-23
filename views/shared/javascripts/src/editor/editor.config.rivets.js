
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * If a record title is null, inject a placeholder string.
 *
 * @param {String|null} title: The title.
 * @return {String}: If the title is null, return the placeholder.
 */
rivets.formatters.recordTitle = function(title) {

  if (title) {

    // Strip tags, limit length.
    title = _.string.truncate(title, 100);
    title = _.string.stripTags(title);
    return title;

  }

  // If no title, show a placeholder.
  else return Neatline.g.neatline.strings.record.placeholders.title;

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
