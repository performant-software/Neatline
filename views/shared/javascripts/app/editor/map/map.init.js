
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map editor initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Map', { startWithParent: false,
  define: function(Map, Editor, Backbone, Marionette, $, _) {


  /**
   * Alias the exhibit map view and collection.
   */
  Map.init = function() {
    this.__collection = Neatline.Map.__collection;
    this.__view = Neatline.Map.__view;
  };

  Map.addInitializer(Map.init);


}});
