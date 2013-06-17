
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Styles | Router', function() {


  var el, fx = {
    exhibit: read('EditorStyles.json')
  };


  beforeEach(function() {

    NL.loadEditor();

    el = {
      styles: NL.vw.EXHIBIT.$('li[data-slug="styles"]')
    };

  });


  it('#styles', function() {

    NL.navigate('styles');
    NL.respondLast200(fx.exhibit);

    // Tabs, styles form should be visible.
    expect(NL.vw.EDITOR.__ui.editor).toContain(NL.vw.EXHIBIT.$el);
    expect(NL.vw.EDITOR.__ui.editor).toContain(NL.vw.STYLES.$el);

    // "Styles" tab should be active.
    expect(el.styles).toHaveClass('active');

  });


});
