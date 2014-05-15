
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter', function(Presenter) {


  Presenter.addInitializer(function() {
    Presenter.__controller = new Presenter.Controller();
  });


});
