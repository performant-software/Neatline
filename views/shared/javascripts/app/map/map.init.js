
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  this.ID = 'MAP';


  this.addInitializer(function() {
    this.__collection = new Neatline.Shared.Record.Collection();
    this.__view = new Neatline.Map.View({ el: '#neatline-map' });
  });


});
