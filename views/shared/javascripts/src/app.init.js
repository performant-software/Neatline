
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline = new Marionette.Application();


/**
 * Match routes once Neatline is running.
 */
Neatline.on('initialize:after', function() {
  Backbone.history.start();
});
