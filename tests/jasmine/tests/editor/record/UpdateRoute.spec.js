
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Update Route', function() {


  var fixtures = {
    record: read('EditorRecord.record.json')
  };


  beforeEach(function() {
    NL.loadEditor();
  });


  describe('should update tab routes', function() {

    it('for an unsaved record', function() {

      // ----------------------------------------------------------------------
      // When the tab is changed in the edit form for an unsaved record, the
      // route should update to link to the current tab. For example, when the
      // "Map" tab is active, the route should be:
      //
      // `#edit/new/map`
      //
      // When the "Item" tab is active:
      //
      // `#edit/new/item`
      //
      // etc.
      // ----------------------------------------------------------------------

      NL.navigate('edit/new');

      _.each(NL.getRoutableTabSlugs(), function(slug) {

        NL.clickTab(slug);

        // Route should update.
        NL.assertRoute('edit/new/'+slug);

      });

    });

    it('for a saved record', function() {

      // ----------------------------------------------------------------------
      // When the tab is changed in the edit form for a saved record, the
      // route should update to link to the current tab. For example, when the
      // "Map" tab is active, the route should be:
      //
      // `#edit/<id>/map`
      //
      // When the "Item" tab is active:
      //
      // `#edit/<id>/item`
      //
      // etc.
      // ----------------------------------------------------------------------

      NL.showRecordForm(fixtures.record);
      var id = NL.v.record.model.id;

      _.each(NL.getRoutableTabSlugs(), function(slug) {

        NL.clickTab(slug);

        // Route should update.
        NL.assertRoute('edit/'+id+'/'+slug);

      });

    });

  });


  describe('should remove the tab route on the "Text" tab', function() {

    // ------------------------------------------------------------------------
    // When the tab is changed from one of the routable slugs back to the
    // "Text" tab, the route should revert back to the default URL.
    // ------------------------------------------------------------------------

    it('for an unsaved record', function() {

      NL.navigate('edit/new');

      _.each(NL.getRoutableTabSlugs(), function(slug) {

        // Click the routable tab, then back to "Text".
        NL.clickTab(slug);
        NL.clickTab('text');

        // Should revert back to default route.
        NL.assertRoute('edit/new');

      });

    });

    it('for a saved record', function() {

      NL.showRecordForm(fixtures.record);
      var id = NL.v.record.model.id;

      _.each(NL.getRoutableTabSlugs(), function(slug) {

        // Click the routable tab, then back to "Text".
        NL.clickTab(slug);
        NL.clickTab('text');

        // Should revert back to default route.
        NL.assertRoute('edit/'+id);

      });

    });

  });


});
