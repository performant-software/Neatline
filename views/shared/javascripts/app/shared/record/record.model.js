
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * An individual Neatline record.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared.Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  Record.Model = Backbone.Model.extend({
    url: function() {
      if (this.get('id')) return __exhibit.api.record+'/'+this.get('id');
      else return __exhibit.api.records;
    }
  });


});
