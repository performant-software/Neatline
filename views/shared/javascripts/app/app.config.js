
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Neatline configurations.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Backbone model/collection adapter for Rivets.
 */
rivets.configure({
  adapter: {
    subscribe: function(obj, keypath, callback) {
      obj.on('change:' + keypath, callback)
    },
    unsubscribe: function(obj, keypath, callback) {
      obj.off('change:' + keypath, callback)
    },
    read: function(obj, keypath) {
      return obj.get(keypath);
    },
    publish: function(obj, keypath, value) {
      obj.set(keypath, value)
    }
  }
});


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
  return title ? title : STRINGS.record.placeholders.title;
};
