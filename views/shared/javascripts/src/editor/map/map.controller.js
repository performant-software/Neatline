
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Map', {
  startWithParent: false,
  define: function(Map) {


    Map.Controller = Neatline.Shared.Controller.extend({


      slug: 'EDITOR:MAP',

      commands: [
        'startEdit',
        'endEdit',
        'clearEditLayer',
        'updateEdit',
        'updateSvgWkt',
        'updateModel'
      ],


      /**
       * Alias the public map view.
       */
      init: function() {
        this.view = Neatline.Map.__controller.view;
      },


      /**
       * Start map edit when a record form is opened.
       *
       * @param {Object} model: The record model.
       */
      startEdit: function(model) {
        this.view.startEdit(model);
      },


      /**
       * End map edit when a record form is closed.
       *
       * @param {Object} model: The record model.
       */
      endEdit: function(model) {
        this.view.endEdit();
      },


      /**
       * Empty the edit layer.
       */
      clearEditLayer: function() {
        this.view.clearEditLayer();
      },


      /**
       * Update the map edit controls.
       *
       * @param {Object} settings: The new form settings.
       */
      updateEdit: function(settings) {
        this.view.updateEdit(settings);
      },


      /**
       * Update the WKT on the draw-SVG handler.
       *
       * @param {String} wkt: The WKT.
       */
      updateSvgWkt: function(wkt) {
        this.view.updateSvgWkt(wkt);
      },


      /**
       * Update edit layer model.
       *
       * @param {Object} model: The updated model.
       */
      updateModel: function(model) {
        this.view.updateModel(model);
      }


    });


  }
});
