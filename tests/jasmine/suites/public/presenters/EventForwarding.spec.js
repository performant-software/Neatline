
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Presenter Event Forwarding', function() {


  var model1, model2, exec;


  beforeEach(function() {

    NL.loadNeatline();

    model1 = new Neatline.Shared.Record.Model({
      presenter: 'Presenter1'
    });

    model2 = new Neatline.Shared.Record.Model({
      presenter: 'Presenter2'
    });

    exec = spyOn(Neatline, 'execute');

  });


  it('highlight', function() {

    Neatline.vent.trigger('highlight', model1);

    expect(exec).toHaveBeenCalledWith(
      'PRESENTER:Presenter1:highlight', model1
    );

    expect(exec).not.toHaveBeenCalledWith(
      'PRESENTER:Presenter2:highlight', model2
    );

  });


  it('unhighlight', function() {

    Neatline.vent.trigger('unhighlight', model1);

    expect(exec).toHaveBeenCalledWith(
      'PRESENTER:Presenter1:unhighlight', model1
    );

    expect(exec).not.toHaveBeenCalledWith(
      'PRESENTER:Presenter2:unhighlight', model2
    );

  });


  it('select', function() {

    Neatline.vent.trigger('select', model1);

    expect(exec).toHaveBeenCalledWith(
      'PRESENTER:Presenter1:select', model1
    );

    expect(exec).not.toHaveBeenCalledWith(
      'PRESENTER:Presenter2:select', model2
    );

  });


  it('unselect', function() {

    Neatline.vent.trigger('unselect', model1);

    expect(exec).toHaveBeenCalledWith(
      'PRESENTER:Presenter1:unselect', model1
    );

    expect(exec).not.toHaveBeenCalledWith(
      'PRESENTER:Presenter2:unselect', model2
    );

  });


});
