
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Lists initializers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Lists', function(
  Lists, Editor, Backbone, Marionette, $, _) {


  /**
   * Initialize the local command aggregator.
   */
  Lists.addInitializer(function() {
    Lists.orders = new Backbone.Wreqr.Commands();
  });


});
