/**
 * Form controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Modules.Form = (function(Backbone, Editor) {

  var Form = {};


  /*
   * Instantiate the form view.
   *
   * @return void.
   */
  Form.init = function() {
    this.view = new Editor.Views.Form({ el: '#editor' });
  };


  // -------
  // Events.
  // -------

  /*
   * Show form.
   *
   * @param {Object} model: The record model.
   *
   * @return void.
   */
  Editor.vent.on('records:openForm', function(model) {
    Form.view.show(model);
  });


  // Export.
  Editor.addInitializer(function() { Form.init(); });
  return Form;

})(Backbone, Editor);
