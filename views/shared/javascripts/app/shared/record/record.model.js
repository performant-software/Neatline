
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


    /**
     * Construct the API url.
     *
     * @return {String}: The url.
     */
    url: function() {
      var url = __exhibit.api.record;
      if (this.get('id')) url += ('/'+this.get('id'));
      return url;
    },


    // TODO|dev

    defaults: function() {
      return {
        exhibit_id:     __exhibit.id,
        vector_color:   '#00aeff',
        stroke_color:   '#000000',
        select_color:   '#00aeff',
        vector_opacity: 30,
        stroke_opacity: 90,
        select_opacity: 50,
        image_opacity:  90,
        point_radius:   10,
        stroke_width:   2
      };
    }


  });


});
