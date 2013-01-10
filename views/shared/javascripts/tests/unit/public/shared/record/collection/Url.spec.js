
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Unit tests for `url` on record collection.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Collection `url`', function() {

  var collection;

  beforeEach(function() {
    collection = new Neatline.Shared.Record.Collection();
    __exhibit.api.records = 'records/1';
  });

  it('should form url from `__exhibit` global', function() {

    // --------------------------------------------------------------------
    // The collection's url should match `__exhibit.api.records`.
    // --------------------------------------------------------------------

    expect(collection.url()).toEqual('records/1');

  });

});
