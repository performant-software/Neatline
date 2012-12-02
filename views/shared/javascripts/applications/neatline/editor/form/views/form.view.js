
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

    /*
     * --------------------------------------------------------------------
     * Render the form template, initialize trackers, get element markup.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    initialize: function() {

      // Trackers.
      this.model = null;
      this.started = false;
      this.open = false;

      // Render template.
      this.form = $(this.getTemplate()());

      this.els = {

        // UX.
        tabs: this.form.find('ul.nav a'),

        // Text inputs.
        head:   this.form.find('h3.head'),
        title:  this.form.find('textarea[name="title"]'),
        body:   this.form.find('textarea[name="body"]'),

        // Geometry editing options.
        sides:      this.form.find('input[name="sides"]'),
        snap:       this.form.find('input[name="snap"]'),
        irregular:  this.form.find('input[name="irregular"]'),
        coverage:   this.form.find('textarea[name="coverage"]'),
        geoInputs:  this.form.find('div.geometry input'),

        // Style inputs.
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

        // Buttons.
        saveButton:   this.form.find('button[name="save"]'),
        closeButton:  this.form.find('button[name="close"]'),
        delButton:    this.form.find('button[name="del"]')

      };

      // Bind input listeners.
      this.bindEvents();

    },

    /*
     * --------------------------------------------------------------------
     * Bind event listeners to form elements.
     * --------------------------------------------------------------------
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
      this.els.geoInputs.on('change keyup',
        _.bind(function(e) {
          this.updateMap();
      }, this));

    },

    /*
     * --------------------------------------------------------------------
     * Show the form; block if the form is already open.
     * --------------------------------------------------------------------
     *
     * @param {Object} model: The record model.
     * @param {Boolean} focus: If true, focus the map on the edit layer.
     *
     * @return void.
     */
    show: function(model, focus) {

      // Block if open.
      if (this.open) return;

      // Publish, set trackers.
      Neatline.vent.trigger('editor:form:open', model, focus);
      this.open = true;

      // Store model, render.
      this.model = model;
      this.$el.html(this.form);
      this.render();

    },

    /*
     * --------------------------------------------------------------------
     * Close the form, publish the event, set the global tracker.
     * --------------------------------------------------------------------
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

    /*
     * --------------------------------------------------------------------
     * Render new values from `this.model` into the form elements.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    render: function() {

      // Activate "Text" tab.
      if (!this.started) this.setStarted();

      // Reset map editing.
      this.resetMapControl();

      // Text.
      this.els.head.            text(this.model.get('title'));
      this.els.title.           val(this.model.get('title'));
      this.els.body.            val(this.model.get('description'));

      // Spatial.
      this.els.coverage.        val(this.model.get('coverage'));

      // Styles.
      this.els.vectorColor.     val(this.model.get('vector_color'));
      this.els.strokeColor.     val(this.model.get('stroke_color'));
      this.els.selectColor.     val(this.model.get('select_color'));
      this.els.vectorOpacity.   val(this.model.get('vector_opacity'));
      this.els.strokeOpacity.   val(this.model.get('stroke_opacity'));
      this.els.selectOpacity.   val(this.model.get('select_opacity'));
      this.els.imageOpacity.    val(this.model.get('graphic_opacity'));
      this.els.strokeWidth.     val(this.model.get('stroke_width'));
      this.els.pointRadius.     val(this.model.get('point_radius'));
      this.els.pointGraphic.    val(this.model.get('point_image'));
      this.els.minZoom.         val(this.model.get('min_zoom'));
      this.els.maxZoom.         val(this.model.get('max_zoom'));

    },

    /*
     * --------------------------------------------------------------------
     * Save the current form values.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    save: function() {

      // Commit model.
      this.model.save({

        // Text.
        title:              this.els.title.val(),
        description:        this.els.body.val(),

        // Styles.
        vector_color:       this.els.vectorColor.val(),
        stroke_color:       this.els.strokeColor.val(),
        select_color:       this.els.selectColor.val(),
        vector_opacity:     this.els.vectorOpacity.val(),
        stroke_opacity:     this.els.strokeOpacity.val(),
        select_opacity:     this.els.selectOpacity.val(),
        graphic_opacity:    this.els.imageOpacity.val(),
        stroke_width:       this.els.strokeWidth.val(),
        point_radius:       this.els.pointRadius.val(),
        point_image:        this.els.pointGraphic.val(),
        min_zoom:           this.els.minZoom.val(),
        max_zoom:           this.els.maxZoom.val(),
        coverage:           this.els.coverage.val()

      }, {

        // Update head and button.
        success: _.bind(function() {
          this.updateHead();
        }, this)

      });

    },

    /*
     * --------------------------------------------------------------------
     * Activate "Text" as the starting tab selection.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    setStarted: function() {
      $(this.els.tabs[0]).tab('show');
      this.started = true;
    },

    /*
     * --------------------------------------------------------------------
     * Render the record title in the header block at the top of the form.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    updateHead: function() {
      this.els.head.text(this.model.get('title'));
    },

    /*
     * --------------------------------------------------------------------
     * Collect and publish current edit geometry settings.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    updateMap: function() {

      // Get values.
      var settings = {
        modify:   this.getModifySettings(),
        sides:    this.els.sides.val(),
        irreg:    this.els.irregular.is(':checked'),
        control:  this.getMapControl(),
        snap:     this.els.snap.val()
      };

      // Publish.
      Neatline.vent.trigger('editor:form:updateMap', settings);

    },

    /*
     * --------------------------------------------------------------------
     * Get the value of the current map control mode.
     * --------------------------------------------------------------------
     *
     * @return string: The input value.
     */
    getMapControl: function() {
      return $('input[name="mapControls"]:checked').val();
    },

    /*
     * --------------------------------------------------------------------
     * Set the map control to "Navigate".
     * --------------------------------------------------------------------
     *
     * @return string: The input value.
     */
    resetMapControl: function() {
      return $('input[name="mapControls"]')[0].checked = true;
    },

    /*
     * --------------------------------------------------------------------
     * Get an array of the values of all checked modify settings.
     * --------------------------------------------------------------------
     *
     * @return
     */
    getModifySettings: function() {
      var inputs = $('input[name="modifySettings"]:checked');
      return _.map(inputs, function(i) { return $(i).val(); });
    },

    /*
     * --------------------------------------------------------------------
     * Update the coverage textarea.
     * --------------------------------------------------------------------
     *
     * @param {String} coverage: The new KML.
     * @return void.
     */
    setCoverage: function(coverage) {
      this.els.coverage.val(coverage);
    }

  });


});
