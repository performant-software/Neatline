
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for record form text tab.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Form Text Tab', function() {


  beforeEach(function() {
    _t.loadEditor();
    _t.showFirstRecordForm();
  });


  it('should autocomplete Omeka items under search box', function() {

    // --------------------------------------------------------------------
    // When text is typed into the "Omneka ID" box, a list of Omeka items
    // that match the query should be autocompleted below the box.
    // --------------------------------------------------------------------

    // TODO

  });

  it('should populate id and title on item select', function() {

    // --------------------------------------------------------------------
    // When an autocomplete option is selected, the "Omeka ID" box should
    // be populated with the id and the "Title" field should be populated
    // with the title of the Omeka item.
    // --------------------------------------------------------------------

    // TODO

  });


});
