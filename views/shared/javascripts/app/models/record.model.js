
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * An individual Neatline record.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Models', function(
  Models, Neatline, Backbone, Marionette, $, _) {


  Models.Record = Backbone.Model.extend({


    url: function() {
      return __exhibit.api+'/'+this.get('id');
    }


  });


});
