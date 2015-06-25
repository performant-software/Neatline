
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Events', {
  startWithParent: false,
  define: function(Events) {

    Neatline.on('initialize:after', function() {
      Events.start();
      Backbone.history.start();
    });

    Events.addInitializer(function() {
      Events.__controller = new Events.Controller();
      Events.__router = new Events.Router();
    });

  }
});
