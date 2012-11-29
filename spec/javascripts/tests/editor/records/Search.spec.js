
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Record search tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Records Search', function() {

  var editor, records, server;
  var json = readFixtures('records.json');

  // Get fixtures.
  beforeEach(function() {

    // Load partial, mock server.
    loadFixtures('editor-partial.html');
    server = sinon.fakeServer.create();

    // Run Editor.
    _t.loadEditor();

    // Intercept requests.
    _.each(server.requests, function(r) {
      _t.respond200(r, json);
    });

  });

  it('should execute a keyword query on `Enter`');

  it('should execute a keyword query on search button click');

  it('should execute a tags query on `Enter`');

  it('should execute a tags query on search button click');

  it('should enable map mirroring on button click');

  it('should disable text search when mirroring is enabled');

  it('should disable text search on cancel button click');

  it('should disable mirroring on cancel button click');

});
