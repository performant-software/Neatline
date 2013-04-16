
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Presenter incoming events tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Presenter API', function() {


  var model, exec;


  beforeEach(function() {
    _t.loadNeatline();
    model = new Neatline.Shared.Record.Model({ presenter: 'P' });
    exec = spyOn(Neatline, 'execute');
  });


  it('show', function() {
    Neatline.vent.trigger('show', model);
    expect(exec).toHaveBeenCalledWith('PRESENTER:P:show', model);
  });


  it('hide', function() {
    Neatline.vent.trigger('hide', model);
    expect(exec).toHaveBeenCalledWith('PRESENTER:P:hide', model);
  });


  it('select', function() {
    Neatline.vent.trigger('select', model);
    expect(exec).toHaveBeenCalledWith('PRESENTER:P:select', model);
  });


  it('unselect', function() {
    Neatline.vent.trigger('unselect', model);
    expect(exec).toHaveBeenCalledWith('PRESENTER:P:unselect', model);
  });


});
