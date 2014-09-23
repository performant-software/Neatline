
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('API | Presenter', function() {


  var model, exec;


  beforeEach(function() {

    NL.loadNeatline();

    model = new Neatline.Shared.Record.Model({ presenter: 'P' });
    exec = NL.getCommandSpy();

  });


  it('should forward events to presenter-specific commands', function() {

    // ------------------------------------------------------------------------
    // When a record is (un)highlighted or (un)selected, the presenter should
    // "forward" the event to the presenter-specific command for the presenter
    // that the record is assigned to.
    // ------------------------------------------------------------------------

    _.each(['highlight', 'unhighlight', 'select', 'unselect'], function(e) {
      Neatline.vent.trigger(e, { model: model });
      expect(exec).toHaveBeenCalledWith('PRESENTER:P:'+e, model);
    });

  });


});
