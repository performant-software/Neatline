
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form | Item Search', function() {


  var el, fx = {
    record: read('EditorRecord.record.json'),
    items:  read('EditorRecordItemSearch.items.xml')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showRecordForm(fx.record);

    el = {
      autocomplete: $(NL.vw.TEXT.__ui.item.autocomplete('widget')[0])
    };

  });


  it('should autocomplete Omeka items under search box', function() {

    // --------------------------------------------------------------------
    // When text is typed into the "Omneka ID" box, a list of Omeka items
    // that match the query should be autocompleted below the box.
    // --------------------------------------------------------------------

    // Enter item search query.
    NL.vw.TEXT.__ui.item.autocomplete('search', 'item');

    // Should produce GET request to /items/browse.
    NL.assertLastRequestRoute(Neatline.g.neatline.items_api);
    NL.assertLastRequestMethod('GET');

    // Should emit query and output format.
    NL.assertLastRequestHasGetParameter('search', 'item');
    NL.assertLastRequestHasGetParameter('output', 'omeka-xml');

    // Respond with items list.
    NL.respondXmlLast200(fx.items);

    // Get widget container and items.
    var items = el.autocomplete.find('a');

    // Should list items.
    expect(items[0]).toHaveText('Item 3');
    expect(items[1]).toHaveText('Item 2');
    expect(items[2]).toHaveText('Item 1');

  });


  it('should populate id and title on item select', function() {

    // --------------------------------------------------------------------
    // When an autocomplete result is chosen, the "Omeka ID" and "Title"
    // inputs should be populated and the `item_id` and `title` fields on
    // the record model should be synchronized with the inputs.
    // --------------------------------------------------------------------

    // Get the id of the autocomplete result.
    var items = $(fx.items);
    var id = items.find('item').first().attr('itemId');

    // Enter item search query.
    NL.vw.TEXT.__ui.item.autocomplete('search', 'item');
    NL.respondXmlLast200(fx.items);

    // Click on the first option.
    el.autocomplete.find('a').first().click();

    // Should populate id.
    expect(NL.vw.TEXT.__ui.item).toHaveValue(id);
    expect(NL.vw.RECORD.model.get('item_id')).toEqual(id);

    // Should populate title.
    expect(NL.vw.TEXT.__ui.title).toHaveValue('Item 3');
    expect(NL.vw.RECORD.model.get('title')).toEqual('Item 3');

  });


});
