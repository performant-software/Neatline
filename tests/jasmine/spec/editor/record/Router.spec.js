
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


  describe('#record/:id/:tab', function() {

    afterEach(function() {
      // Record form should be visible.
      expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORD.$el);
    });

    it('text', function() {
      _t.navigate(href+'/text');
      // "Text" tab active.
      _t.assertActiveTab('text');
    });

    it('spatial', function() {
      _t.navigate(href+'/spatial');
      // "Spatial" tab active.
      _t.assertActiveTab('spatial');
    });

    it('style', function() {
      _t.navigate(href+'/style');
      // "Style" tab active.
      _t.assertActiveTab('style');
    });

  });


  it('#record/add', function() {

    _t.navigate('record/add');

    // Record form should be visible, "Text" tab active.
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORD.$el);
    _t.assertActiveTab('text');

  });


  describe('#record/add/:tab', function() {

    afterEach(function() {
      // Record form should be visible.
      expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.RECORD.$el);
    });

    it('text', function() {
      _t.navigate('record/add/text');
      // "Text" tab active.
      _t.assertActiveTab('text');
    });

    it('spatial', function() {
      _t.navigate('record/add/spatial');
      // "Spatial" tab active.
      _t.assertActiveTab('spatial');
    });

    it('style', function() {
      _t.navigate('record/add/style');
      // "Style" tab active.
      _t.assertActiveTab('style');
    });

  });


});
