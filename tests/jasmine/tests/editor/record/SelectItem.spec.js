
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Select Item', function() {


  var async = new AsyncSpec(this);


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

      // Show the "Item" tab.
      NL.showRecordForm(fixtures.record.item);
      NL.v.record.activateTab('item');

      // Should set the current item.
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

      // Show the "Item" tab.
      NL.showRecordForm(fixtures.record.noItem);
      NL.v.record.activateTab('item');

      // Should leave the input empty.
      expect(NL.v.itemTab.__ui.search.select2('data')).toBeNull();

    });

  });

  describe('when the dropdown is opened', function() {

    beforeEach(function() {

      // Show the "Item" tab.
      NL.showRecordForm(fixtures.record.noItem);
      NL.v.record.activateTab('item');

    });

    async.it('should load all items when dropdown is opened', function(done) {

      // ----------------------------------------------------------------------
      // When the search dropdown is opened, it should immediately load and
      // display a (paginated) list of all items on the site.
      // ----------------------------------------------------------------------

      // When the dropdown is opened...
      NL.v.itemTab.__ui.search.on('select2-open', function(e) {

        // Respond to the request.
        NL.respondLast200(fixtures.items.all);

      });

      // When the record response arrives...
      NL.v.itemTab.__ui.search.on('select2-loaded', function(e) {

        // Should generate GET request to the item search API.
        NL.assertLastRequestRoute(Neatline.g.neatline.item_search_api);
        NL.assertLastRequestMethod('GET');

        done();

      });

      // Open the dropdown.
      NL.v.itemTab.__ui.search.select2('open');

      done(); // TODO|dev

    });

    it('should load results when search query is entered',  function() {

      // ----------------------------------------------------------------------
      // When a search query is entered, matching items should be loaded.
      // ----------------------------------------------------------------------

    });

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
