
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor router test.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Router', function() {

  beforeEach(function() {
    _t.loadEditor();
  });

  it('#records', function() {

    // --------------------------------------------------------------------
    // #records should display the editor menu, search, and record list.
    // --------------------------------------------------------------------

    _t.navigate('records');

    // Menu, search, and records displayed.
    expect(_t.el.editor).toContain(_t.el.menu);
    expect(_t.el.editor).toContain(_t.el.search);
    expect(_t.el.editor).toContain(_t.el.records);

    // "Records" tab activated.
    expect(_t.vw.menu.__ui.tabs.records).toHaveClass('active');

  });

  it('#record/:id', function() {

    // --------------------------------------------------------------------
    // #records/:id should display a record edit form.
    // --------------------------------------------------------------------

    _t.navigate('records/1');
    expect(_t.el.editor).toContain(_t.el.record);

  });

  it('#record/add', function() {

    // --------------------------------------------------------------------
    // #records/add should display a record add form.
    // --------------------------------------------------------------------

    _t.navigate('records/add');
    expect(_t.el.editor).toContain(_t.el.record);

  });

  it('#tags', function() {

    // --------------------------------------------------------------------
    // #records should display the editor menu and tag list.
    // --------------------------------------------------------------------

    _t.navigate('tags');

    // Menu, search, and records displayed.
    expect(_t.el.editor).toContain(_t.el.menu);
    expect(_t.el.editor).toContain(_t.el.tags);

    // "Records" tab activated.
    expect(_t.vw.menu.__ui.tabs.tags).toHaveClass('active');

  });

  it('#tag/:id', function() {

    // --------------------------------------------------------------------
    // #tag/:id should display a tag edit form.
    // --------------------------------------------------------------------

    _t.navigate('tags/1');
    expect(_t.el.editor).toContain(_t.el.tag);

  });

  it('#tag/add', function() {

    // --------------------------------------------------------------------
    // #tag/add should display a tag add form.
    // --------------------------------------------------------------------

    _t.navigate('tags/add');
    expect(_t.el.editor).toContain(_t.el.tag);

  });

});
