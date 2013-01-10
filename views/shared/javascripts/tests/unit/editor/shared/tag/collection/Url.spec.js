
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Unit tests for `url` on tag collection.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Tag Collection `url`', function() {

  var collection;

  beforeEach(function() {

    _t.loadEditor();

    // Create collection, set tags api.
    collection = new Neatline.Editor.Shared.Tag.Collection();
    __editor.api.tags = 'tags/1';

  });

  it('should form url from `__editor` global', function() {

    // --------------------------------------------------------------------
    // The collection's url should match `__exhibit.api.records`.
    // --------------------------------------------------------------------

    expect(collection.url()).toEqual('tags/1');

  });

});
