
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tag browser tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Tags List', function() {

  var tagRows, tagModels;

  beforeEach(function() {

    _t.loadEditor();
    _t.showTagsList();

    tagRows     = _t.getTagRows();
    tagModels   = _t.getTagModels();

  });

  it('should list records', function() {

    // --------------------------------------------------------------------
    // At #tags, a list of tags should be rendered in the editor.
    // --------------------------------------------------------------------

    // Check listings.
    expect(tagRows.length).toEqual(3);
    expect($(tagRows[0]).find('.tag').text()).
      toEqual('tag1');
    expect($(tagRows[1]).find('.tag').text()).
      toEqual('tag2');
    expect($(tagRows[2]).find('.tag').text()).
      toEqual('tag3')

    // Check links.
    expect($(tagRows[0]).attr('href')).
      toEqual('#tags/'+tagModels[0].get('id'));
    expect($(tagRows[1]).attr('href')).
      toEqual('#tags/'+tagModels[1].get('id'));
    expect($(tagRows[2]).attr('href')).
      toEqual('#tags/'+tagModels[2].get('id'));

  });

});
