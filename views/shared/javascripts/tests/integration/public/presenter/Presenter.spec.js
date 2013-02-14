
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Presenter API tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Presenter API', function() {


  var model, execute;


  beforeEach(function() {
    _t.loadNeatline();
    model = new Neatline.Shared.Record.Model({ presenter: 'P' });
    exec  = spyOn(Neatline, 'execute').andCallThrough();
  });


  it('show', function() {
    Neatline.commands.addHandler('presenter:P:show', function() {});
    Neatline.execute('presenter:show', model);
    expect(exec).toHaveBeenCalledWith('presenter:P:show', model);
  });


  it('hide', function() {
    Neatline.commands.addHandler('presenter:P:hide', function() {});
    Neatline.execute('presenter:hide', model);
    expect(exec).toHaveBeenCalledWith('presenter:P:hide', model);
  });


  it('select', function() {
    Neatline.commands.addHandler('presenter:P:select', function() {});
    Neatline.execute('presenter:select', model);
    expect(exec).toHaveBeenCalledWith('presenter:P:select', model);
  });


  it('unselect', function() {
    Neatline.commands.addHandler('presenter:P:unselect', function() {});
    Neatline.execute('presenter:unselect', model);
    expect(exec).toHaveBeenCalledWith('presenter:P:unselect', model);
  });


});
