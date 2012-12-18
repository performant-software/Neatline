
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * "Style" tab view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Forms.Views', function(
  Views, Forms, Backbone, Marionette, $, _) {


  Views.StyleTab = Backbone.View.extend({


    /**
     * Get element markup.
     */
    initialize: function() {
      this.vectorColor    = this.$el.find('input[name="vector-color"]');
      this.strokeColor    = this.$el.find('input[name="stroke-color"]');
      this.selectColor    = this.$el.find('input[name="select-color"]');
      this.vectorOpacity  = this.$el.find('input[name="vector-opacity"]');
      this.strokeOpacity  = this.$el.find('input[name="stroke-opacity"]');
      this.selectOpacity  = this.$el.find('input[name="select-opacity"]');
      this.imageOpacity   = this.$el.find('input[name="image-opacity"]');
      this.strokeWidth    = this.$el.find('input[name="stroke-width"]');
      this.pointRadius    = this.$el.find('input[name="point-radius"]');
      this.pointImage     = this.$el.find('input[name="point-image"]');
      this.minZoom        = this.$el.find('input[name="min-zoom"]');
      this.maxZoom        = this.$el.find('input[name="max-zoom"]');
    },


    /**
     * Populate input elements with model values.
     *
     * @param {Object} model: The record model.
     */
    render: function(model) {
      this.vectorColor.   val(model.get('vector_color'));
      this.strokeColor.   val(model.get('stroke_color'));
      this.selectColor.   val(model.get('select_color'));
      this.vectorOpacity. val(model.get('vector_opacity'));
      this.strokeOpacity. val(model.get('stroke_opacity'));
      this.selectOpacity. val(model.get('select_opacity'));
      this.imageOpacity.  val(model.get('image_opacity'));
      this.strokeWidth.   val(model.get('stroke_width'));
      this.pointRadius.   val(model.get('point_radius'));
      this.pointImage.    val(model.get('point_image'));
      this.minZoom.       val(model.get('min_zoom'));
      this.maxZoom.       val(model.get('max_zoom'));
    },


    /**
     * Return title and body values object.
     *
     * @param {Object}: The values.
     */
    gather: function(model) {
      return {
        vector_color:     this.vectorColor.val(),
        stroke_color:     this.strokeColor.val(),
        select_color:     this.selectColor.val(),
        vector_opacity:   parseInt(this.vectorOpacity.val(), 10),
        stroke_opacity:   parseInt(this.strokeOpacity.val(), 10),
        select_opacity:   parseInt(this.selectOpacity.val(), 10),
        image_opacity:    parseInt(this.imageOpacity.val(), 10),
        stroke_width:     parseInt(this.strokeWidth.val(), 10),
        point_radius:     parseInt(this.pointRadius.val(), 10),
        point_image:      this.pointImage.val(),
        min_zoom:         parseInt(this.minZoom.val(), 10),
        max_zoom:         parseInt(this.maxZoom.val(), 10)
      };
    }


  });


});
