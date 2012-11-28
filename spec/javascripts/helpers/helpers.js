
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

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

  // Restart application.
  Neatline.initCallbacks.reset();
  Neatline.start();

  // Shortcut components
  this.map = Neatline.Modules.Map.view;

};

/*
 * Load editor application.
 */
_t.loadEditor = function() {

  // Restart application.
  Neatline.initCallbacks.reset();
  Editor.initCallbacks.reset();
  Editor.start();

  // Shortcut editor components
  this.layout = Editor.Modules.Layout.view;
  this.records = Editor.Modules.Records.view;
  this.form = Editor.Modules.Form.view;

  // Shortcut application components
  this.map = Neatline.Modules.Map.view;

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
  return this.map.map.getLayersBy('features', {
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
  request.respond(200, {
    'Content-Type':'application/json'
  }, response);
};
