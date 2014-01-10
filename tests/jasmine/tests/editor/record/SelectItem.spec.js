
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Select Item', function() {


  var fixtures = {

    record: {
      noItem: read('EditorRecordSelectItem.noItem.record.json'),
      item:   read('EditorRecordSelectItem.item.record.json')
    },

    items: {
      search: read('EditorRecordSelectItem.search.items.xml'),
      all:    read('EditorRecordSelectItem.all.items.xml')
    }

  };


  beforeEach(function() {
    NL.loadEditor();
  });


  describe('when the tab is shown', function() {

    it('should set the current item when one exists', function() {

      // ----------------------------------------------------------------------
      // When the "Item" tab is shown for a record that is linked to an item,
      // the item id / title should be populated in the search box.
      // ----------------------------------------------------------------------

      var record = NL.recordFromJson(fixtures.record.item);

      // Show the tab.
      NL.showRecordForm(fixtures.record.item);
      NL.v.record.activateTab('item');

      // TODO|dev
      expect(NL.v.itemTab.__ui.search.select2('data')).toEqual({
        id: record.get('item_id'), text: record.get('item_title')
      });

    });

    it('should do nothing when no item has been set', function() {

      // ----------------------------------------------------------------------
      // When the "Item" tab is shown for a record that is not linked to an
      // item, the search box should be left empty.
      // ----------------------------------------------------------------------

      var record = NL.recordFromJson(fixtures.record.noItem);

      // Show the tab.
      NL.showRecordForm(fixtures.record.noItem);
      NL.v.record.activateTab('item');

      // TODO|dev
      expect(NL.v.itemTab.__ui.search.select2('data')).toBeNull();

    });

  });

  describe('when the dropdown is opened', function() {

    it('should load all items when dropdown is opened');

    it('should load results when search query is entered');

  });

  describe('when an item is selected', function() {

    it('should set item id and title');

    it('should (re)load item body preview');

  });

  describe('when the item is cleared', function() {

    it('should unset the item id and title');

    it('should unset the item body preview');

  });


});
