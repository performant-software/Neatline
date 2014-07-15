
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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


  it('#edit/:id', function() {

    // ------------------------------------------------------------------------
    // When `#edit/:id` is requested, the record form should be displayed
    // and the "Text" tab should be activated by default.
    // ------------------------------------------------------------------------

    NL.navigate(href);

    // Record form should be visible, "Text" tab active.
    expect(NL.v.editor.__ui.editor).toContainHtml(NL.v.record.$el);
    NL.assertActiveTab('text');

  });


  it('#edit/:id/:tab', function() {

    // ------------------------------------------------------------------------
    // When `#edit/:id/:tab` is requested, the record form should be
    // displayed and the requested tab should be activated.
    // ------------------------------------------------------------------------

    _.each(NL.getRoutableTabSlugs(), function(slug) {

      NL.navigate(href+'/'+slug);

      // Record form should be visible, requested tab active.
      expect(NL.v.editor.__ui.editor).toContainHtml(NL.v.record.$el);
      NL.assertActiveTab(slug);

    });

  });


  it('#edit/new', function() {

    // ------------------------------------------------------------------------
    // When `#edit/new` is requested, the record form should be displayed
    // and the "Text' tab should be activated by default.
    // ------------------------------------------------------------------------

    NL.navigate('edit/new');

    // Record form should be visible, "Text" tab active.
    expect(NL.v.editor.__ui.editor).toContainHtml(NL.v.record.$el);
    NL.assertActiveTab('text');

  });


  it('#edit/new/:tab', function() {

    // ------------------------------------------------------------------------
    // When `#edit/new/:tab` route is requested, the record form should be
    // displayed and the requested tab should be activated.
    // ------------------------------------------------------------------------

    _.each(NL.getRoutableTabSlugs(), function(slug) {

      NL.navigate('edit/new/'+slug);

      // Record form should be visible, requested tab active.
      expect(NL.v.editor.__ui.editor).toContainHtml(NL.v.record.$el);
      NL.assertActiveTab(slug);

    });

  });


});
