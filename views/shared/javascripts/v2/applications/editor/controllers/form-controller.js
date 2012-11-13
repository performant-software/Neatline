/**
 * Form controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

NeatlineEditor.Controllers.Form = (function(Backbone, NeatlineEditor) {

  var Form = {};


  /*
   * Instantiate the form view.
   *
   * @return void.
   */
  Form.init = function() {
    Form.Form = new NeatlineEditor.Views.Form();
  };


  // Export.
  NeatlineEditor.addInitializer(function() { Form.init(); });
  return Form;

})(Backbone, NeatlineEditor);
