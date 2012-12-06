
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * "Style" tab view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Form.StyleTab.Views', function(
  Views, StyleTab, Backbone, Marionette, $, _) {


  Views.Tab = Backbone.View.extend({


    /**
     * Get element markup.
     *
     * @param {Object|DOMElement} form: The form element.
     * @return void.
     */
    getElements: function(form) {
      this.vectorColor    = form.find('input[name="vector-color"]');
      this.strokeColor    = form.find('input[name="stroke-color"]');
      this.selectColor    = form.find('input[name="select-color"]');
      this.vectorOpacity  = form.find('input[name="vector-opacity"]');
      this.strokeOpacity  = form.find('input[name="stroke-opacity"]');
      this.selectOpacity  = form.find('input[name="select-opacity"]');
      this.imageOpacity   = form.find('input[name="image-opacity"]');
      this.strokeWidth    = form.find('input[name="stroke-width"]');
      this.pointRadius    = form.find('input[name="point-radius"]');
      this.pointGraphic   = form.find('input[name="point-image"]');
      this.minZoom        = form.find('input[name="min-zoom"]');
      this.maxZoom        = form.find('input[name="max-zoom"]');
    },


    /**
     * Populate input elements with model values.
     *
     * @param {Object} model: The record model.
     * @return void.
     */
    render: function(model) {
      this.vectorColor.   val(model.get('vector_color'));
      this.strokeColor.   val(model.get('stroke_color'));
      this.selectColor.   val(model.get('select_color'));
      this.vectorOpacity. val(model.get('vector_opacity'));
      this.strokeOpacity. val(model.get('stroke_opacity'));
      this.selectOpacity. val(model.get('select_opacity'));
      this.imageOpacity.  val(model.get('graphic_opacity'));
      this.strokeWidth.   val(model.get('stroke_width'));
      this.pointRadius.   val(model.get('point_radius'));
      this.pointGraphic.  val(model.get('point_image'));
      this.minZoom.       val(model.get('min_zoom'));
      this.maxZoom.       val(model.get('max_zoom'));
    },


    /**
     * Return title and body values object.
     *
     * @param {Object}: The values.
     * @return void.
     */
    gather: function(model) {
      return {
        vector_color:     this.vectorColor.val(),
        stroke_color:     this.strokeColor.val(),
        select_color:     this.selectColor.val(),
        vector_opacity:   parseInt(this.vectorOpacity.val(), 10),
        stroke_opacity:   parseInt(this.strokeOpacity.val(), 10),
        select_opacity:   parseInt(this.selectOpacity.val(), 10),
        graphic_opacity:  parseInt(this.imageOpacity.val(), 10),
        stroke_width:     parseInt(this.strokeWidth.val(), 10),
        point_radius:     parseInt(this.pointRadius.val(), 10),
        point_image:      this.pointGraphic.val(),
        min_zoom:         parseInt(this.minZoom.val(), 10),
        max_zoom:         parseInt(this.maxZoom.val(), 10)
      };
    }


  });


});
