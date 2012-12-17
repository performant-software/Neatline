
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * "Text" tab view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Form.SpatialTab.Views', function(
  Views, SpatialTab, Backbone, Marionette, $, _) {


  Views.Tab = Backbone.View.extend({


    /**
     * Get element markup.
     *
     * @param {Object|DOMElement} form: The form element.
     * @return void.
     */
    getElements: function(form) {

      // Elements:
      this.pan          = form.find('input[value="pan"]');
      this.point        = form.find('input[value="point"]');
      this.line         = form.find('input[value="line"]');
      this.poly         = form.find('input[value="poly"]');
      this.regPoly      = form.find('input[value="regPoly"]');
      this.modify       = form.find('input[value="modify"]');
      this.remove       = form.find('input[value="remove"]');
      this.coverage     = form.find('textarea[name="coverage"]');
      this.sides        = form.find('input[name="sides"]');
      this.irregular    = form.find('input[name="irregular"]');
      this.snap         = form.find('input[name="snap"]');

      // Listen for edit mode changes.
      form.find('div.geometry input').on('change keyup',
        _.bind(function(e) { this.updateMap(); }, this)
      );

    },


    /**
     * Populate input elements with model values.
     *
     * @param {Object} model: The record model.
     * @return void.
     */
    render: function(model) {
      this.resetMapControl();
      this.coverage.val(model.get('coverage'));
    },


    /**
     * Return title and body values object.
     *
     * @param {Object}: The values.
     * @return void.
     */
    gather: function(model) {
      return {
        coverage: this.coverage.val()
      };
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
        sides:    this.sides.val(),
        irreg:    this.irregular.is(':checked'),
        control:  this.getMapControl(),
        snap:     this.snap.val()
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
      this.coverage.val(coverage);
    }


  });


});
