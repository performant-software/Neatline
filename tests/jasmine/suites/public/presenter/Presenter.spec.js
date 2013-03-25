
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
    Neatline.commands.setHandler('PRESENTER:P:show', function() {});
    Neatline.execute('PRESENTER:show', model);
    expect(exec).toHaveBeenCalledWith('PRESENTER:P:show', model);
  });


  it('hide', function() {
    Neatline.commands.setHandler('PRESENTER:P:hide', function() {});
    Neatline.execute('PRESENTER:hide', model);
    expect(exec).toHaveBeenCalledWith('PRESENTER:P:hide', model);
  });


  it('select', function() {
    Neatline.commands.setHandler('PRESENTER:P:select', function() {});
    Neatline.execute('PRESENTER:select', model);
    expect(exec).toHaveBeenCalledWith('PRESENTER:P:select', model);
  });


  it('unselect', function() {
    Neatline.commands.setHandler('PRESENTER:P:unselect', function() {});
    Neatline.execute('PRESENTER:unselect', model);
    expect(exec).toHaveBeenCalledWith('PRESENTER:P:unselect', model);
  });


});
