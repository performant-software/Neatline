
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Application globals.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * OpenLayers theme image source.
 */
OpenLayers.ImgPath = 'http://js.mapbox.com/theme/dark/';


/**
 * Backbone model adapter for Rivets.
 */
rivets.configure({
  adapter: {
    subscribe: function(obj, keypath, callback) {
      obj.on('change:' + keypath, callback);
    },
    unsubscribe: function(obj, keypath, callback) {
      obj.off('change:' + keypath, callback);
    },
    read: function(obj, keypath) {
      return obj.get(keypath);
    },
    publish: function(obj, keypath, value) {
      obj.set(keypath, value);
    }
  }
});
