
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


  var href;


  beforeEach(function() {
    _t.loadEditor();
    href = $(_t.getRecordRows()[0]).attr('href');
  });


  it('#record/:id', function() {

    _t.navigate(href);

    // Record form should be visible, "Text" tab active.
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORD.$el);
    _t.assertActiveTab('text');

  });


  it('#record/:id/:tab', function() {
    _.each(_t.getTabSlugs(), function(slug) {

      _t.navigate(href+'/'+slug);

      // Record form should be visible, requested tab active.
      expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORD.$el);
      _t.assertActiveTab(slug);

    });
  });


  it('#record/add', function() {

    _t.navigate('record/add');

    // Record form should be visible, "Text" tab active.
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORD.$el);
    _t.assertActiveTab('text');

  });


  it('#record/add/:tab', function() {
    _.each(_t.getTabSlugs(), function(slug) {

      _t.navigate('record/add/'+slug);

      // Record form should be visible, requested tab active.
      expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORD.$el);
      _t.assertActiveTab(slug);

    });
  });


});
