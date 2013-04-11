
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


  var el;


  beforeEach(function() {

    _t.loadEditor();

    el = {
      styles: _t.vw.EXHIBIT.$('li[data-slug="styles"]')
    };

  });


  it('#styles', function() {

    _t.showStyles();

    // Tabs, styles form should be visible.
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.EXHIBIT.$el);
    expect(_t.vw.EDITOR.__ui.editor).toContain(_t.vw.STYLES.$el);

    // "Styles" tab should be active.
    expect(el.styles).toHaveClass('active');

  });


});
