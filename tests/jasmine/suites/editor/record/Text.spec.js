
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record form text tab.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Text Tab', function() {


  var el;


  beforeEach(function() {

    _t.loadEditor();
    _t.showRecordForm(_t.json.RecordForm.record);

    el = {
      autocomplete: $(_t.vw.TEXT.__ui.item.autocomplete('widget')[0])
    };

  });


  it('should autocomplete Omeka items under search box', function() {

    // --------------------------------------------------------------------
    // When text is typed into the "Omneka ID" box, a list of Omeka items
    // that match the query should be autocompleted below the box.
    // --------------------------------------------------------------------

    // Enter item search query.
    _t.vw.TEXT.__ui.item.autocomplete('search', 'item');

    // Should produce GET request to /items/browse.
    _t.assertLastRequestRoute(Neatline.global.items_api);
    _t.assertLastRequestMethod('GET');

    // Should emit query and output format.
    _t.assertLastRequestHasGetParameter('search', 'item');
    _t.assertLastRequestHasGetParameter('output', 'omeka-xml');

    // Respond with items list.
    _t.respondXmlLast200(_t.xml.RecordFormText.items);

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
    _t.vw.TEXT.__ui.item.autocomplete('search', 'item');
    _t.respondXmlLast200(_t.xml.RecordFormText.items);

    // Click on the first option.
    el.autocomplete.find('a').first().click();

    // Should populate id.
    expect(_t.vw.TEXT.__ui.item).toHaveValue(
      $(_t.xml.RecordFormText.items).find('item').first().attr('itemId')
    );

    // Should populate title.
    expect(_t.vw.TEXT.__ui.title).toHaveValue('Item 3');

  });


});
