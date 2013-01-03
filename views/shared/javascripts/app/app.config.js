
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
      if (obj instanceof Backbone.Collection) {
        obj.on('add remove reset', function () {
          callback(obj[keypath]);
        });
      } else {
        obj.on('change:' + keypath, function (m, v) { callback(v) });
      };
    },

    unsubscribe: function(obj, keypath, callback) {
      if (obj instanceof Backbone.Collection) {
        obj.off('add remove reset', function () {
          callback(obj[keypath]) 
        });
      } else {
        obj.off('change:' + keypath, function (m, v) { callback(v) });
      };
    },

    read: function(obj, keypath) {
      if (obj instanceof Backbone.Collection) {
        return obj['models'];
      } else {
        return obj.get(keypath);
      }
    },

    publish: function(obj, keypath, value) {
      if (obj instanceof Backbone.Collection) {
        obj[keypath] = value;
      } else {
        obj.set(keypath, value);
      };
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
