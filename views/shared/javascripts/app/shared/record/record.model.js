
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
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
      var url = Neatline.global.records_api;
      if (this.id) url += ('/'+this.id);
      return url;
    },


    defaults: function() {
      return {
        exhibit_id:             Neatline.global.exhibit.id,
        presenter:              'StaticBubble',
        fill_color:             '#00aeff',
        fill_color_select:      '#00aeff',
        stroke_color:           '#000000',
        stroke_color_select:    '#000000',
        fill_opacity:           30,
        fill_opacity_select:    40,
        stroke_opacity:         90,
        stroke_opacity_select:  100,
        point_radius:           10,
        stroke_width:           2
      };
    }


  });


});
