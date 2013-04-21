
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Text Tab', function() {


  var el;


  beforeEach(function() {

    NL.loadEditor();
    NL.showRecordForm(NL.json.RecordForm.record);

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
    NL.assertLastRequestRoute(Neatline.globals.items_api);
    NL.assertLastRequestMethod('GET');

    // Should emit query and output format.
    NL.assertLastRequestHasGetParameter('search', 'item');
    NL.assertLastRequestHasGetParameter('output', 'omeka-xml');

    // Respond with items list.
    NL.respondXmlLast200(NL.xml.RecordFormText.items);

    // Get widget container and items.
    var items = el.autocomplete.find('a');

    // Should list items.
    expect(items[0]).toHaveText('Item 3');
    expect(items[1]).toHaveText('Item 2');
    expect(items[2]).toHaveText('Item 1');

  });

  it('should populate id and title on item select', function() {

    // --------------------------------------------------------------------
    // When an autocomplete option is selected, the "Omeka ID" box should
    // be populated with the id and the "Title" field should be populated
    // with the title of the Omeka item.
    // --------------------------------------------------------------------

    // Enter item search query.
    NL.vw.TEXT.__ui.item.autocomplete('search', 'item');
    NL.respondXmlLast200(NL.xml.RecordFormText.items);

    // Click on the first option.
    el.autocomplete.find('a').first().click();

    // Should populate id.
    expect(NL.vw.TEXT.__ui.item).toHaveValue(
      $(NL.xml.RecordFormText.items).find('item').first().attr('itemId')
    );

    // Should populate title.
    expect(NL.vw.TEXT.__ui.title).toHaveValue('Item 3');

  });


});
