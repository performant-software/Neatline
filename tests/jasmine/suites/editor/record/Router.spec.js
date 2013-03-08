
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record router test.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Router', function() {


  var id;


  beforeEach(function() {
    _t.loadEditor();
    id = _t.getRecordListModels()[0].get('id');
  });


  it('#record/:id/:tab', function() {

    // --------------------------------------------------------------------
    // When `#record/:id/:tab` route is requested, the record form should
    // be displayed and the requested tab should be activated.
    // --------------------------------------------------------------------

    // Walk tabs.
    _.each(_t.getTabSlugs(), function(slug) {

      _t.navigate('record/'+id+'/'+slug);

      // Record form should be visible, requested tab active.
      expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORD.$el);
      _t.assertActiveTab(slug);

    });

  });


  it('#record/add/:tab', function() {

    // --------------------------------------------------------------------
    // When `#record/add/:tab` route is requested, the record form should
    // be displayed and the requested tab should be activated.
    // --------------------------------------------------------------------

    // Walk tabs.
    _.each(_t.getTabSlugs(), function(slug) {

      _t.navigate('record/add/'+slug);

      // Record form should be visible, requested tab active.
      expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORD.$el);
      _t.assertActiveTab(slug);

    });

  });


});
