
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Widget Tab Templating', function() {


  beforeEach(function() {
    NL.loadEditor();
  });


  it('should not template exhibit tabs', function() {

    // --------------------------------------------------------------------
    // When no exhibit widget tabs are registered, the "Plugins" dropdown
    // menu should not be displayed.
    // --------------------------------------------------------------------

    expect(NL.vw.EXHIBIT.$el).not.toContain('li.dropdown');

  });


  it('should not template record tabs', function() {

    // --------------------------------------------------------------------
    // When no record widget tabs are registered, the "Plugins" dropdown
    // menu should not be displayed.
    // --------------------------------------------------------------------

    expect(NL.vw.RECORD.$el).not.toContain('li.dropdown');

  });


});
