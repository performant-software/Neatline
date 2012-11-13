/**
 * Form controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Controllers.Form = (function(Backbone, Editor) {

  var Form = {};


  /*
   * Instantiate the form view.
   *
   * @return void.
   */
  Form.init = function() {
    Form.Form = new Editor.Views.Form({ el: '#records' });
  };


  // Export.
  Editor.addInitializer(function() { Form.init(); });
  return Form;

})(Backbone, Editor);
