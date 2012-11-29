
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Search controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Modules.Search = (function(Backbone, Editor) {

  var Search = {};


  /*
   * Instantiate the search view.
   *
   * @return void.
   */
  Search.init = function() {
    this.view = new Editor.Views.Search({ el: '#search' });
  };


  // Export.
  Editor.addInitializer(function() { Search.init(); });
  return Search;

})(Backbone, Editor);
