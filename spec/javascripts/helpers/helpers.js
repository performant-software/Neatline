/**
 * Testing helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


_t = {};


// --------------------
// Application loaders.
// --------------------

/*
 * Load neatline application.
 */
_t.loadNeatline = function() {

  // Restart components.
  Neatline.Modules.Exhibit.init();
  Neatline.Modules.Map.init();

  // Shortcut components
  _t.map = Neatline.Modules.Map.view;

};

/*
 * Load editor application.
 */
_t.loadEditor = function() {

  // Restart components.
  Editor.Controllers.Layout.init();
  Editor.Controllers.Records.init();
  Editor.Controllers.Form.init();

  // Shortcut components
  _t.layout = Editor.Controllers.Layout.view;
  _t.records = Editor.Controllers.Records.view;
  _t.form = Editor.Controllers.Records.view;

};


// --------
// Helpers.
// --------

/*
 * Get vector layers on the map.
 */
_t.getVectorLayers = function() {

  // Filter for features.length > 0.
  return _t.map.map.getLayersBy('features', {
    test: function(prop) {
      return !_.isUndefined(prop) && prop.length > 0;
    }
  });

};
