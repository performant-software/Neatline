
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Unit tests for `url` on tag model.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Tag Model `url`', function() {

  var model;

  beforeEach(function() {
    model = new Neatline.Editor.Shared.Tag.Model();
    __editor.api.tags = 'tags/1';
    __editor.api.tag  = 'tag';
    __editor.id = 1;
  });

  it('should form url with id when id is set', function() {

    // --------------------------------------------------------------------
    // When the `id` attribute is populated on the model, the model's url
    // should point to `tag/:record_id`.
    // --------------------------------------------------------------------

    model.set('id', 1);
    expect(model.url()).toEqual('tag/1');

  });

  it('should form url with collection id when id is not set', function() {

    // --------------------------------------------------------------------
    // When the `id` attribute is not populated on the model, the model's
    // url should point to `tags/:collection_id`.
    // --------------------------------------------------------------------

    expect(model.url()).toEqual('tags/1');

  });

});
