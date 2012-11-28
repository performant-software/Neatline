
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Tests for model retrival in the core records collection.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records Model Retrieval', function() {

  var server, layers;

  // Load AJAX fixtures.
  var json = readFixtures('records.json');

  // Get fixtures.
  beforeEach(function() {

    // Load partial, mock server.
    loadFixtures('neatline-partial.html');
    server = sinon.fakeServer.create();

    // Run Neatline.
    _t.loadNeatline();

    // Intercept requests.
    _.each(server.requests, function(r) {
      _t.respond200(r, json);
    });

  });

  it('should immediately return a model when it is present', function() {

    var done = false;

    // Capture starting requests count.
    var startCount = server.requests.length;

    // Query for existing model.
    var id = _t.records.models[0].get('id');
    _t.records.getModel(id, function(model) {
      expect(model.get('id')).toEqual(id);
      done = true;
    });

    waitsFor(function() {
      return done;
    });

    // No new ajax.
    runs(function() {
      expect(server.requests.length).toEqual(startCount);
    });

  });

  it('should create and fetch the model when it is absent');

});
