
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Tabs', function() {


  beforeEach(function() {
    _t.loadEditor();
  });


  it('should update route for unsaved record', function() {

    // --------------------------------------------------------------------
    // When the tabs are toggled in the edit form for an unsaved record,
    // the route should update to provide a hard link to the current tab.
    // For example, when the "Text" tab is active, the route should be:
    //
    // `#record/add/text`
    //
    // When the "Map" tab is active:
    //
    // `#record/add/map`
    //
    // etc.
    // --------------------------------------------------------------------

    _t.navigate('record/add');

    _.each(_t.getTabSlugs(), function(slug) {

      // Click on the tab.
      var tab = _t.vw.RECORD.$('a[href="#record-'+slug+'"]')
      tab.trigger('click');

      // Route should update.
      expect(Backbone.history.fragment).toEqual('record/add/'+slug);

    });

  });


  it('should update route for saved record', function() {

    // --------------------------------------------------------------------
    // When the tabs are toggled in the edit form for a saved record, the
    // route should update to provide a hard link to the current tab. For
    // example, when the "Text" tab is active, the route should be:
    //
    // `#record/<id>/text`
    //
    // When the "Map" tab is active:
    //
    // `#record/<id>/map`
    //
    // etc.
    // --------------------------------------------------------------------

    _t.showRecordForm(_t.json.RecordForm.record);
    var id = _t.vw.RECORD.model.id;

    _.each(_t.getTabSlugs(), function(slug) {

      // Click on the tab.
      var tab = _t.vw.RECORD.$('a[href="#record-'+slug+'"]')
      tab.trigger('click');

      // Route should update.
      expect(Backbone.history.fragment).toEqual('record/'+id+'/'+slug);

    });

  });


});
