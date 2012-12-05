
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Form view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Form.Views', function(
  Views, Form, Backbone, Marionette, $, _) {


  Views.Form = Backbone.View.extend({


    getTemplate: function() {
      return _.template($('#edit-form').html());
    },


    /**
     * Render the form template, initialize trackers, get element markup.
     *
     * @return void.
     */
    initialize: function() {

      /**
       * Trackers.
       */

      this.model = null; // The model currently bound to the form.
      this.started = false; // True if the form has been displayed.
      this.open = false; // True if the form is currently open.
      this.data = {}; // Aggregate data gathered from tabs.

      // Render template.
      this.form = $(this.getTemplate()());

      this.els = {

                        // Text:
        head:           this.form.find('h3.head'),
        title:          this.form.find('textarea[name="title"]'),
        body:           this.form.find('textarea[name="body"]'),

                        // Spatial:
        pan:            this.form.find('input[value="pan"]'),
        point:          this.form.find('input[value="point"]'),
        line:           this.form.find('input[value="line"]'),
        poly:           this.form.find('input[value="poly"]'),
        regPoly:        this.form.find('input[value="regPoly"]'),
        modify:         this.form.find('input[value="modify"]'),
        remove:         this.form.find('input[value="remove"]'),
        sides:          this.form.find('input[name="sides"]'),
        snap:           this.form.find('input[name="snap"]'),
        irregular:      this.form.find('input[name="irregular"]'),
        coverage:       this.form.find('textarea[name="coverage"]'),

                        // Style:
        vectorColor:    this.form.find('input[name="vector-color"]'),
        strokeColor:    this.form.find('input[name="stroke-color"]'),
        selectColor:    this.form.find('input[name="select-color"]'),
        vectorOpacity:  this.form.find('input[name="vector-opacity"]'),
        strokeOpacity:  this.form.find('input[name="stroke-opacity"]'),
        selectOpacity:  this.form.find('input[name="select-opacity"]'),
        imageOpacity:   this.form.find('input[name="image-opacity"]'),
        strokeWidth:    this.form.find('input[name="stroke-width"]'),
        pointRadius:    this.form.find('input[name="point-radius"]'),
        pointGraphic:   this.form.find('input[name="point-image"]'),
        minZoom:        this.form.find('input[name="min-zoom"]'),
        maxZoom:        this.form.find('input[name="max-zoom"]'),
        mapFocus:       this.form.find('button[name="map-focus"]'),

                        // Buttons:
        saveButton:     this.form.find('button[name="save"]'),
        closeButton:    this.form.find('button[name="close"]'),
        delButton:      this.form.find('button[name="del"]'),

                        // Groups:
        tabs:           this.form.find('ul.nav a'),
        spatialInputs:  this.form.find('div.geometry input')

      };

      // Bind input listeners.
      Neatline.vent.trigger('editor:form:initialize', this.form);
      this.bindEvents();

    },


    /**
     * Bind event listeners to form elements.
     *
     * @return void.
     */
    bindEvents: function() {

      // Close button.
      // -------------
      this.els.closeButton.click(_.bind(function(e) {
        e.preventDefault();
        this.close();
      }, this));

      // Save button.
      // ------------
      this.els.saveButton.click(_.bind(function(e) {
        e.preventDefault();
        this.save();
      }, this));

      // Spatial controls.
      // -----------------
      this.els.spatialInputs.on('change keyup',
        _.bind(function(e) {
          this.updateMap();
      }, this));

    },


    /**
     * Show the form; block if the form is already open.
     *
     * @param {Object} model: The record model.
     * @param {Boolean} focus: If true, focus the map on the edit layer.
     * @return void.
     */
    show: function(model, focus) {

      // Block if open.
      if (this.open) return;

      // Store model, render.
      this.model = model;
      this.$el.html(this.form);
      this.render();

      // Publish, set trackers.
      Neatline.vent.trigger('editor:form:open', model, focus);
      this.open = true;

    },


    /**
     * Close the form, publish the event, set the global tracker.
     *
     * @return void.
     */
    close: function() {

      // Hide, publish.
      this.form.detach();
      Neatline.vent.trigger('editor:form:close', this.model);

      // Trackers.
      this.model = null;
      this.open = false;

    },


    /**
     * Render new values from `this.model` into the form elements.
     *
     * @return void.
     */
    render: function() {

      if (!this.started) this.setStarted();
      this.els.head.text(this.model.get('title'));

      // // Reset map editing.
      // this.resetMapControl();

      // // Text.
      // this.els.title.           val(this.model.get('title'));
      // this.els.body.            val(this.model.get('description'));

      // // Spatial.
      // this.els.coverage.        val(this.model.get('coverage'));

      // // Styles.
      // this.els.vectorColor.     val(this.model.get('vector_color'));
      // this.els.strokeColor.     val(this.model.get('stroke_color'));
      // this.els.selectColor.     val(this.model.get('select_color'));
      // this.els.vectorOpacity.   val(this.model.get('vector_opacity'));
      // this.els.strokeOpacity.   val(this.model.get('stroke_opacity'));
      // this.els.selectOpacity.   val(this.model.get('select_opacity'));
      // this.els.imageOpacity.    val(this.model.get('graphic_opacity'));
      // this.els.strokeWidth.     val(this.model.get('stroke_width'));
      // this.els.pointRadius.     val(this.model.get('point_radius'));
      // this.els.pointGraphic.    val(this.model.get('point_image'));
      // this.els.minZoom.         val(this.model.get('min_zoom'));
      // this.els.maxZoom.         val(this.model.get('max_zoom'));

    },


    /**
     * Save the current form values.
     *
     * @return void.
     */
    save: function() {

      // Gather field data.
      Neatline.vent.trigger('editor:form:getData');

      // Save the model.
      this.model.save(this.data, {

        // Update the header.
        success: _.bind(function() {
          this.updateHead();
        }, this)

      });

    },


    /**
     * Activate "Text" as the starting tab selection.
     *
     * @return void.
     */
    setStarted: function() {
      $(this.els.tabs[0]).tab('show');
      this.started = true;
    },


    /**
     * Render the record title in the header block at the top of the form.
     *
     * @return void.
     */
    updateHead: function() {
      this.els.head.text(this.model.get('title'));
    },


    /**
     * Collect and publish current edit geometry settings.
     *
     * @return void.
     */
    updateMap: function() {

      // Get values.
      var settings = {
        modify:   this.getmodifyOptions(),
        sides:    this.els.sides.val(),
        irreg:    this.els.irregular.is(':checked'),
        control:  this.getMapControl(),
        snap:     this.els.snap.val()
      };

      // Publish.
      Neatline.vent.trigger('editor:form:updateMap', settings);

    },


    /**
     * Get the value of the current map control mode.
     *
     * @return string: The input value.
     */
    getMapControl: function() {
      return $('input[name="editMode"]:checked').val();
    },


    /**
     * Set the map control to "Navigate".
     *
     * @return string: The input value.
     */
    resetMapControl: function() {
      return $('input[name="editMode"]')[0].checked = true;
    },


    /**
     * Get an array of the values of all checked modify settings.
     *
     * @return {Array}: An array of 0-3 strings representing the current
     * combination of options: "rotate", "resize", "drag".
     */
    getmodifyOptions: function() {
      var inputs = $('input[name="modifyOptions"]:checked');
      return _.map(inputs, function(i) { return $(i).val(); });
    },


    /**
     * Update the coverage textarea.
     *
     * @param {String} coverage: The new KML.
     * @return void.
     */
    setCoverage: function(coverage) {
      this.els.coverage.val(coverage);
    }


  });


});
