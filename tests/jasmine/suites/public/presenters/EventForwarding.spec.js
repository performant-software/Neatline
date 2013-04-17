
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Presenter event forwarding tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Presenter Event Forwarding', function() {


  var model, exec;


  beforeEach(function() {
    _t.loadNeatline();
    model = new Neatline.Shared.Record.Model({ presenter: 'P' });
    exec = spyOn(Neatline, 'execute');
  });


  it('highlight', function() {
    Neatline.vent.trigger('highlight', model);
    expect(exec).toHaveBeenCalledWith('PRESENTER:P:highlight', model);
  });


  it('unhighlight', function() {
    Neatline.vent.trigger('unhighlight', model);
    expect(exec).toHaveBeenCalledWith('PRESENTER:P:unhighlight', model);
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
