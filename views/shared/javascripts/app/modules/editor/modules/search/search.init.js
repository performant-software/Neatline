
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Search initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Search', function(
  Search, Editor, Backbone, Marionette, $, _) {


  /**
   * Instantiate the search view.
   *
   * @return void.
   */
  Search.addInitializer(function() {
    this.view = new Search.Views.Search({ el: '#search' });
  });


});
