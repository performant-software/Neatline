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
  Editor.Modules.Layout.init();
  Editor.Modules.Records.init();
  Editor.Modules.Map.init();
  Editor.Modules.Form.init();

  // Shortcut components
  _t.layout = Editor.Modules.Layout.view;
  _t.records = Editor.Modules.Records.view;
  _t.form = Editor.Modules.Form.view;

};


// --------
// Helpers.
// --------

/*
 * Get vector layers on the map.
 *
 * @return void.
 */
_t.getVectorLayers = function() {

  // Filter for features.length > 0.
  return _t.map.map.getLayersBy('features', {
    test: function(prop) {
      return !_.isUndefined(prop) && prop.length > 0;
    }
  });

};

/*
 * Inject mock into ajax request.
 *
 * @param {Object} request: The mocked sinon request.
 * @param {Object} response: The response body.
 *
 * @return void.
 */
_t.respond200 = function(request, response) {
  request.respond(200, {'Content-Type':'application/json'},response);
};
