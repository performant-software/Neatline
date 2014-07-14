
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


  it('should update route for unsaved record', function() {

    // ------------------------------------------------------------------------
    // When the tabs are changed in the edit form for an unsaved record, the
    // route should update to provide a link to the current tab. For example,
    // when the "Text" tab is active, the route should be:
    //
    // `#edit/new/text`
    //
    // When the "Map" tab is active:
    //
    // `#edit/new/map`
    //
    // etc.
    // ------------------------------------------------------------------------

    NL.navigate('edit/new');

    _.each(NL.getTabSlugs(), function(slug) {

      // Click on the tab.
      var tab = NL.v.record.$('a[href="#record-'+slug+'"]')
      tab.trigger('click');

      // Route should update.
      expect(Backbone.history.fragment).toEqual('edit/new/'+slug);

    });

  });


  it('should update route for saved record', function() {

    // ------------------------------------------------------------------------
    // When the tabs are changed in the edit form for a saved record, the
    // route should update to provide a link to the current tab. For example,
    // when the "Text" tab is active, the route should be:
    //
    // `#edit/<id>/text`
    //
    // When the "Map" tab is active:
    //
    // `#edit/<id>/map`
    //
    // etc.
    // ------------------------------------------------------------------------

    NL.showRecordForm(fixtures.record);
    var id = NL.v.record.model.id;

    _.each(NL.getTabSlugs(), function(slug) {

      // Click on the tab.
      var tab = NL.v.record.$('a[href="#record-'+slug+'"]')
      tab.trigger('click');

      // Route should update.
      expect(Backbone.history.fragment).toEqual('edit/'+id+'/'+slug);

    });

  });


});
