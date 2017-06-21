
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Shared.Record', function(Record) {


  Record.Model = Backbone.Model.extend({


    mutators: {

      title: {
        get: function() {
          return this.attributes.title || this.attributes.item_title;
        }
      },

      item: {
        get: function() {

          // Load the item body, if it isn't already loaded.
          if (_.isUndefined(this.attributes.item)) this.loadItem();
          return this.attributes.item;

        },
      }

    },


    /**
     * Coerce numberic fields to Number instances.
     */
    initialize: function() {

      new Backbone.Schema(this).define({
        item_id:                { type: 'number' },
        fill_opacity:           { type: 'number' },
        fill_opacity_select:    { type: 'number' },
        stroke_opacity:         { type: 'number' },
        stroke_opacity_select:  { type: 'number' },
        point_radius:           { type: 'number' },
        stroke_width:           { type: 'number' },
        zindex:                 { type: 'number' },
        weight:                 { type: 'number' },
        min_zoom:               { type: 'number' },
        max_zoom:               { type: 'number' },
        map_zoom:               { type: 'number' }
      });

    },


    /**
     * Remove the lazy-loaded `item` content before saving.
     *
     * @return {Object}: The record values.
     */
    toJSON: function() {
      return _.omit(_.clone(this.attributes), 'item');
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
     * Add new records to the current exhibit and apply the style defaults.
     *
     * @return {Object}: The default attributes.
     */
    defaults: function() {
      return _.extend(Neatline.g.neatline.styles, {
        exhibit_id: Neatline.g.neatline.exhibit.id
      });
    },


    /**
     * Load the metadata for the Omeka item associated with the record.
     *
     * @param {Function} cb
     */
    loadItem: function(cb) {

      // Break if no parent item.
      if (!this.has('item_id')) return;

      // Query `/items/<item_id>`.
      var url = Neatline.g.neatline.item_body_api+'/'+this.get('item_id');
      var params = { record: this.id };

      // Load the item body.
      $.get(url, params, _.bind(function(response) {
        this.set('item', response);
        if (cb) cb(response);
      }, this));

    },


    /**
     * Clear out the cached item body and trigger change on the `item` key.
     */
    resetItem: function() {
      this.attributes.item = undefined;
      this.trigger('change:item');
    },


    /**
     * Is the record tagged with a given tag?
     *
     * @param {String} tag: The tag.
     * @return {Boolean}
     */
    hasTag: function(tag) {
      return _.contains(this.splitTags(), tag);
    },


    /**
     * Split the comma-delimited tag string.
     *
     * @return {Array}
     */
    splitTags: function() {

      var tags = this.get('tags');
      if (!tags) return [];

      // Split and trim the tags.
      else return _.map(tags.split(','), function(tag) {
        return _.string.trim(tag);
      });

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
          fillOpacity:      (1.0 + fillOpacitySelect) / 2.0,
          graphicOpacity:   (1.0 + fillOpacitySelect) / 2.0,
          strokeOpacity:    strokeOpacitySelect,
          strokeWidth:      strokeWidth,
          pointRadius:      pointRadius,
          externalGraphic:  externalGraphic
        })

      });

    }


  });


});
