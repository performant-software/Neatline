
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared.Record', function(Record) {


  Record.Model = Backbone.Model.extend({


    /**
     * Construct the API url.
     *
     * @return {String}: The url.
     */
    url: function() {
      var url = Neatline.g.neatline.records_api;
      if (this.id) url += ('/'+this.id);
      return url;
    },


    defaults: function() {

      // Alias the style defaults.
      var styles = Neatline.g.neatline.styles;

      return {
        exhibit_id:             Neatline.g.neatline.exhibit.id,
        presenter:              styles.presenter,
        fill_color:             styles.fill_color,
        fill_color_select:      styles.fill_color_select,
        stroke_color:           styles.stroke_color,
        stroke_color_select:    styles.stroke_color_select,
        fill_opacity:           Number(styles.fill_opacity),
        fill_opacity_select:    Number(styles.fill_opacity_select),
        stroke_opacity:         Number(styles.stroke_opacity),
        stroke_opacity_select:  Number(styles.stroke_opacity_select),
        point_radius:           Number(styles.point_radius),
        stroke_width:           Number(styles.stroke_width)
      };

    }


  });


});
