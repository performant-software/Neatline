
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record model unit tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Model', function() {

  beforeEach(function() {
    _t.loadNeatline();
  });

  it('should build the record API route', function() {

    // --------------------------------------------------------------------
    // The `url` method should return the REST API route for the model.
    // --------------------------------------------------------------------

    // Create model, set exhibit api root.
    var model = new Neatline.Models.Record({ id: 1 });
    __exhibit.api = 'api';

    // Check route construction.
    expect(model.url()).toEqual('api/1');

  });

});
