/**
 * Form view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Views.Form = Backbone.View.extend({

  getTemplate: function() {
    return _.template($('#edit-form').html());
  },

  /*
   * Render form template, get components.
   *
   * @return void.
   */
  initialize: function() {

    // Render template.
    this.form = $(this.getTemplate()());

    // Text.
    this.head =           this.form.find('h3.head');
    this.title =          this.form.find('textarea[name="title"]');
    this.body =           this.form.find('textarea[name="body"]');

    // Styles.
    this.vectorColor =    this.form.find('input[name="vector-color"]');
    this.strokeColor =    this.form.find('input[name="stroke-color"]');
    this.selectColor =    this.form.find('input[name="select-color"]');
    this.vectorOpacity =  this.form.find('input[name="vector-opacity"]');
    this.strokeOpacity =  this.form.find('input[name="stroke-opacity"]');
    this.selectOpacity =  this.form.find('input[name="select-opacity"]');
    this.graphicOpacity = this.form.find('input[name="graphic-opacity"]');
    this.strokeWidth =    this.form.find('input[name="stroke-width"]');
    this.pointRadius =    this.form.find('input[name="point-radius"]');
    this.pointGraphic =   this.form.find('input[name="point-graphic"]');
    this.mapFocus =       this.form.find('button[name="map-focus"]');

    // Buttons.
    this.saveButton =     this.form.find('button[name="save"]');
    this.closeButton =    this.form.find('button[name="close"]');
    this.delButton =      this.form.find('button[name="del"]');

    // Bind form listeners.
    this.bindEvents();

  },

  /*
   * Show the form.
   *
   * @param {Object} model: The record model.
   *
   * @return void.
   */
  show: function(model) {
    this.model = model;
    this.$el.html(this.form);
    this.renderData();
  },

  /*
   * Close the form.
   *
   * @return void.
   */
  close: function(model) {
    this.form.detach();
    Editor.vent.trigger('form:close');
  },

  /*
   * Bind event listeners to form elements.
   *
   * @return void.
   */
  bindEvents: function() {

    // Buttons.
    // --------

    this.closeButton.bind({

      mousedown: _.bind(function() {
        this.close();
      }, this),

      click: _.bind(function(e) {
        e.preventDefault();
      }, this)

    });

  },

  /*
   * Render form values.
   *
   * @return void.
   */
  renderData: function() {

    // Text.
    this.head.            text(this.model.get('title'));
    this.title.           val(this.model.get('title'));
    this.body.            val(this.model.get('body'));

    // Styles.
    this.vectorColor.     val(this.model.get('vector_color'));
    this.strokeColor.     val(this.model.get('stroke_color'));
    this.selectColor.     val(this.model.get('select_color'));
    this.vectorOpacity.   val(this.model.get('vector_opacity'));
    this.strokeOpacity.   val(this.model.get('stroke_opacity'));
    this.selectOpacity.   val(this.model.get('select_opacity'));
    this.graphicOpacity.  val(this.model.get('graphic_opacity'));
    this.strokeWidth.     val(this.model.get('stroke_width'));
    this.pointRadius.     val(this.model.get('point_radius'));
    this.pointGraphic.    val(this.model.get('point_graphic'));

  }

});
