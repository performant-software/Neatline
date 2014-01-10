
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
    it('should set the current item when one exists');
    it('should do nothing when no item has been set');
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
