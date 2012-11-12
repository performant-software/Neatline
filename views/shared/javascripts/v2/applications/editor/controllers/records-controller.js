/**
 * Records controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

NeatlineEditor.Controllers.Records = (function(Backbone, NeatlineEditor) {

  var Records = {};


  /*
   * Instantiate the records manager.
   *
   * @return void.
   */
  Records.init = function() {
    Records.Records = new NeatlineEditor.Views.Records();
  };


  // Export.
  NeatlineEditor.addInitializer(function() { Records.init(); });
  return Records;

})(Backbone, NeatlineEditor);
