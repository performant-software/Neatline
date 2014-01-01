
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared.Record', function(Record) {


  Record.Model = Backbone.Model.extend({


    mutators: {

      /**
       * Coerce `fill_opacity` to a number.
       *
       * @return {Number}
       */
      fill_opacity: {
        get: function() {
          return Number(this.attributes.fill_opacity);
        }
      },

      /**
       * Coerce `fill_opacity_select` to a number.
       *
       * @return {Number}
       */
      fill_opacity_select: {
        get: function() {
          return Number(this.attributes.fill_opacity_select);
        }
      },

      /**
       * Coerce `stroke_opacity` to a number.
       *
       * @return {Number}
       */
      stroke_opacity: {
        get: function() {
          return Number(this.attributes.stroke_opacity);
        }
      },

      /**
       * Coerce `stroke_opacity_select` to a number.
       *
       * @return {Number}
       */
      stroke_opacity_select: {
        get: function() {
          return Number(this.attributes.stroke_opacity_select);
        }
      },

      /**
       * Coerce `point_radius` to a number.
       *
       * @return {Number}
       */
      point_radius: {
        get: function() {
          return Number(this.attributes.point_radius);
        }
      },

      /**
       * Coerce `stroke_width` to a number.
       *
       * @return {Number}
       */
      stroke_width: {
        get: function() {
          return Number(this.attributes.stroke_width);
        }
      },

      /**
       * Coerce `zindex` to a number.
       *
       * @return {Number}
       */
      zindex: {
        get: function() {
          return Number(this.attributes.zindex);
        }
      },

      /**
       * Coerce `weight` to a number.
       *
       * @return {Number}
       */
      weight: {
        get: function() {
          return Number(this.attributes.weight);
        }
      },

      /**
       * Coerce `min_zoom` to a number.
       *
       * @return {Number}
       */
      min_zoom: {
        get: function() {
          return Number(this.attributes.min_zoom);
        }
      },

      /**
       * Coerce `max_zoom` to a number.
       *
       * @return {Number}
       */
      max_zoom: {
        get: function() {
          return Number(this.attributes.max_zoom);
        }
      },

      /**
       * Coerce `map_zoom` to a number.
       *
       * @return {Number}
       */
      map_zoom: {
        get: function() {
          return Number(this.attributes.map_zoom);
        }
      }

    },


    /**
     * Construct the REST API endpoint for the record. If the record hasn't
     * been saved, use the generic `/records` endpoint, which handles the
     * initial POST request to create a new record. If an ID already exists,
     * use `/records/<id>`, which handles GET, PUT, and DELETE.
     *
     * @return {String}: The url.
     */
    url: function() {
      var url = Neatline.g.neatline.record_api;
      if (!this.isNew()) url += ('/' + this.id);
      return url;
    },


    /**
     * Plug in the templated style defaults.
     *
     * @return {Object}: The default attribute values.
     */
    defaults: function() {

      var styles = Neatline.g.neatline.styles;

      return {

        // Assign the record to the exhibit:

        exhibit_id:             Neatline.g.neatline.exhibit.id,

        // Provide default SVG style values:

        presenter:              styles.presenter,
        fill_color:             styles.fill_color,
        fill_color_select:      styles.fill_color_select,
        stroke_color:           styles.stroke_color,
        stroke_color_select:    styles.stroke_color_select,
        fill_opacity:           styles.fill_opacity,
        fill_opacity_select:    styles.fill_opacity_select,
        stroke_opacity:         styles.stroke_opacity,
        stroke_opacity_select:  styles.stroke_opacity_select,
        point_radius:           styles.point_radius,
        stroke_width:           styles.stroke_width

      };

    },


    /**
     * Construct an OpenLayers style map object.
     *
     * @return {OpenLayers.StyleMap}: The style map.
     */
    getStyleMap: function() {

      var fillColor           = this.get('fill_color');
      var fillColorSelect     = this.get('fill_color_select');
      var strokeColor         = this.get('stroke_color');
      var strokeColorSelect   = this.get('stroke_color_select');
      var fillOpacity         = this.get('fill_opacity');
      var fillOpacitySelect   = this.get('fill_opacity_select');
      var strokeOpacity       = this.get('stroke_opacity');
      var strokeOpacitySelect = this.get('stroke_opacity_select');
      var externalGraphic     = this.get('point_image');
      var strokeWidth         = this.get('stroke_width');
      var pointRadius         = this.get('point_radius');

      fillOpacity             = parseFloat(fillOpacity);
      fillOpacitySelect       = parseFloat(fillOpacitySelect);
      strokeOpacity           = parseFloat(strokeOpacity);
      strokeOpacitySelect     = parseFloat(strokeOpacitySelect);
      strokeWidth             = Number(strokeWidth);
      pointRadius             = Number(pointRadius);

      return new OpenLayers.StyleMap({

        'default': new OpenLayers.Style({
          fillColor:        fillColor,
          strokeColor:      strokeColor,
          fillOpacity:      fillOpacity,
          graphicOpacity:   fillOpacity,
          strokeOpacity:    strokeOpacity,
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          externalGraphic:  externalGraphic
        }),

        'select': new OpenLayers.Style({
          fillColor:        fillColorSelect,
          strokeColor:      strokeColorSelect,
          fillOpacity:      fillOpacitySelect,
          graphicOpacity:   fillOpacitySelect,
          strokeOpacity:    strokeOpacitySelect,
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          externalGraphic:  externalGraphic
        }),

        'temporary': new OpenLayers.Style({
          fillColor:        fillColorSelect,
          strokeColor:      strokeColorSelect,
          fillOpacity:      fillOpacitySelect,
          graphicOpacity:   fillOpacitySelect,
          strokeOpacity:    strokeOpacitySelect,
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          externalGraphic:  externalGraphic
        })

      });

    }


  });


});
