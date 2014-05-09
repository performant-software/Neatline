
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Styles | Apply Routes', function() {


  var elements, fixtures = {
    exhibit: read('EditorStyles.json')
  };


  beforeEach(function() {

    NL.loadEditor();

    elements = {
      styles: NL.v.exhibit.$('li[data-slug="styles"]')
    };

  });


  it('#styles', function() {

    NL.navigate('styles');
    NL.respondLast200(fixtures.exhibit);

    // Tabs, styles form should be visible.
    expect(NL.v.editor.__ui.editor).toContainHtml(NL.v.exhibit.$el);
    expect(NL.v.editor.__ui.editor).toContainHtml(NL.v.styles.$el);

    // "Styles" tab should be active.
    expect(elements.styles).toHaveClass('active');

  });


});
