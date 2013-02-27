
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Styles router test.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Styles Router', function() {


  var els;


  beforeEach(function() {

    _t.loadEditor();

    els = {
      styles: _t.vw.tabs.$('li.styles')
    };

  });


  it('#styles', function() {

    _t.navigate('styles');

    // Tabs, styles form should be visible.
    expect(_t.el.editor).toContain(_t.el.tabs);
    expect(_t.el.editor).toContain(_t.el.styles);

    // "Styles" tab should be active.
    expect(els.styles).toHaveClass('active');

  });


});
