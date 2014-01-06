
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Apply Routes', function() {


  var href, fixtures = {
    records: read('EditorRecord.records.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.respondRecordList200(fixtures.records);

    href = $(NL.getRecordListRows()[0]).attr('href');

  });


  it('#record/:id', function() {

    // ------------------------------------------------------------------------
    // When `#record/:id` is requested, the record form should be displayed
    // and the "Text" tab should be activated by default.
    // ------------------------------------------------------------------------

    NL.navigate(href);

    // Record form should be visible, "Text" tab active.
    expect(NL.v.editor.__ui.editor).toContain(NL.v.record.$el);
    NL.assertActiveTab('text');

  });


  it('#record/:id/:tab', function() {

    // ------------------------------------------------------------------------
    // When `#record/:id/:tab` is requested, the record form should be
    // displayed and the requested tab should be activated.
    // ------------------------------------------------------------------------

    _.each(NL.getTabSlugs(), function(slug) {

      NL.navigate(href+'/'+slug);

      // Record form should be visible, requested tab active.
      expect(NL.v.editor.__ui.editor).toContain(NL.v.record.$el);
      NL.assertActiveTab(slug);

    });

  });


  it('#record/add', function() {

    // ------------------------------------------------------------------------
    // When `#record/add` is requested, the record form should be displayed
    // and the "Text' tab should be activated by default.
    // ------------------------------------------------------------------------

    NL.navigate('record/add');

    // Record form should be visible, "Text" tab active.
    expect(NL.v.editor.__ui.editor).toContain(NL.v.record.$el);
    NL.assertActiveTab('text');

  });


  it('#record/add/:tab', function() {

    // ------------------------------------------------------------------------
    // When `#record/add/:tab` route is requested, the record form should be
    // displayed and the requested tab should be activated.
    // ------------------------------------------------------------------------

    _.each(NL.getTabSlugs(), function(slug) {

      NL.navigate('record/add/'+slug);

      // Record form should be visible, requested tab active.
      expect(NL.v.editor.__ui.editor).toContain(NL.v.record.$el);
      NL.assertActiveTab(slug);

    });

  });


});
