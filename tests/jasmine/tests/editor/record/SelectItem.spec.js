
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


  afterEach(function() {
    NL.v.itemTab.__ui.search.select2('destroy')
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

    var async = new AsyncSpec(this);

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

      // [3] When the items have been loaded...
      NL.v.itemTab.__ui.search.on('select2-loaded', function(e) {
        expect(e.items.results.length).toEqual(5);
        expect(e.items.results[0].text).toEqual('title1 keyword');
        expect(e.items.results[1].text).toEqual('title2 keyword');
        expect(e.items.results[2].text).toEqual('title3 keyword');
        expect(e.items.results[3].text).toEqual('title4');
        expect(e.items.results[4].text).toEqual('title5');
        done();
      });

      // [1] Open the dropdown.
      NL.v.itemTab.__ui.search.select2('open');

      // Wait for Select2 to requests items...
      waitsFor(NL.itemsHaveBeenRequested);

      // [2] When the items have been requested...
      runs(function() {

        // Should generate GET request to the item search API.
        NL.assertLastRequestRoute(Neatline.g.neatline.item_search_api);
        NL.assertLastRequestMethod('GET');

        // Should request omeka-xml action context, first page.
        NL.assertLastRequestHasGetParameter('output', 'omeka-xml');
        NL.assertLastRequestHasGetParameter('page', 1);

        // Respond to the request.
        NL.respondItemSearch200(fixtures.items.all);
        // Triggers `select2-loaded` (above).

      });

    });

    async.it('should load results when query is entered',  function(done) {

      // ----------------------------------------------------------------------
      // When a search query is entered, matching items should be loaded.
      // ----------------------------------------------------------------------

      // [2] When the dropdown is opened...
      NL.v.itemTab.__ui.search.on('select2-open', function(e) {

        // Enter a search query.
        $('.select2-input').val('query').trigger('keyup-change');

        // Wait for Select2 to requests items...
        waitsFor(NL.itemsHaveBeenRequested);

        // [3] When the items have been requested...
        runs(function() {

          // Should generate GET request to the item search API.
          NL.assertLastRequestRoute(Neatline.g.neatline.item_search_api);
          NL.assertLastRequestMethod('GET');

          // Should request query, action context, and page.
          NL.assertLastRequestHasGetParameter('search', 'query');
          NL.assertLastRequestHasGetParameter('output', 'omeka-xml');
          NL.assertLastRequestHasGetParameter('page', 1);

          // Respond to the items request.
          NL.respondItemSearch200(fixtures.items.search);
          // Triggers `select2-loaded` (below).

        });

      });

      // [4] When the items have been loaded...
      NL.v.itemTab.__ui.search.on('select2-loaded', function(e) {
        expect(e.items.results.length).toEqual(3);
        expect(e.items.results[0].text).toEqual('title1 keyword');
        expect(e.items.results[1].text).toEqual('title2 keyword');
        expect(e.items.results[2].text).toEqual('title3 keyword');
        done();
      });

      // [1] Open the dropdown.
      NL.v.itemTab.__ui.search.select2('open');

    });

  });

  describe('when an item is selected', function() {

    var async = new AsyncSpec(this);

    async.beforeEach(function(done) {

      // [2] When the dropdown is opened...
      NL.v.itemTab.__ui.search.on('select2-open', function(e) {

        // Enter a search query.
        $('.select2-input').val('query').trigger('keyup-change');

        // Wait for Select2 to requests items...
        waitsFor(NL.itemsHaveBeenRequested);

        // [3] When the items have been requested...
        runs(function() {

          // Respond to the items request.
          NL.respondItemSearch200(fixtures.items.search);
          // Triggers `select2-loaded` (below).

        });

      });

      // [4] When the items have been loaded...
      NL.v.itemTab.__ui.search.on('select2-loaded', function(e) {

        // Click on the first item result.
        $('.select2-result-label').first().trigger('mouseup');
        done();

      });

      // [1] Select tab, open dropdown.
      NL.showRecordForm(fixtures.record.noItem);
      NL.v.record.activateTab('item');
      NL.v.itemTab.__ui.search.select2('open');

    });

    it('should set item id and title', function() {

      // ----------------------------------------------------------------------
      // When an item is selected, the item id and title fields on the record
      // model should be updated.
      // ----------------------------------------------------------------------

      expect(NL.v.itemTab.model.get('item_title')).toEqual('title1 keyword');
      expect(NL.v.itemTab.model.get('item_id')).not.toBeUndefined();

    });

    it('should (re)load item body preview', function() {

      // ----------------------------------------------------------------------
      // When an item is selected, the item body preview should be reloaded.
      // ----------------------------------------------------------------------

      // Respond with item body.
      NL.respondLast200('item', 'text/html');

      // Should update the preview.
      expect(NL.v.itemTab.$('div.preview')).toHaveText('item');

    });

    describe('when the item is cleared', function() {

      it('should unset the item id and title');

      it('should unset the item body preview');

    });

  });


});
