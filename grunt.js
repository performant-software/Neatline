/*
 * Grunt file.
 */

module.exports = function(grunt) {

  var app =     'views/shared/javascripts/';
  var util =    'views/shared/javascripts/utilities/';
  var lib =     'views/shared/javascripts/libraries/';
  var build =   'views/shared/javascripts/payloads/';
  var edit =    'views/shared/javascripts/editor/';
  var eutil =   edit+'utilities/';

  grunt.initConfig({

    concat: {

      neatline: {
        src: [
          lib+'utilities.js',
          lib+'jquery.getscrollbarwidth.js',
          lib+'openlayers/OpenLayers.min.js',
          lib+'tile.stamen.js',
          // lib+'simile/timeline-api/timeline-api.js',
          lib+'taffy.min.js',
          lib+'underscore.min.js',
          lib+'moment.min.js',
          lib+'iso8601.min.js',
          lib+'raphael.js',
          app+'neatline.js',
          app+'neatline_map.js',
          app+'neatline_timeline.js',
          app+'neatline_items.js',
          util+'positioner.js',
          util+'bubbles.js',
          util+'span_styler.js'
        ],
        dest: build+'neatline.js'
      },

      editor: {
        src: [
          edit+'item_browser.js',
          edit+'item_form.js',
          edit+'edit_geometry.js',
          edit+'layout_builder.js',
          edit+'items_editor.js',
          edit+'map_editor.js',
          edit+'configure_layout.js',
          edit+'configure_map.js',
          edit+'configure_timeline.js',
          edit+'configure_items.js',
          eutil+'_toggle_button.js',
          eutil+'_gradient_builder.js',
          eutil+'_dropdown.js',
          eutil+'_integer_dragger.js',
          edit+'_constructEditor.js',
          lib+'minicolors/jquery.miniColors.min.js',
          lib+'redactor/redactor/redactor.min.js',
          lib+'bootstrap.min.js'
        ],
        dest: build+'editor.js'
      }

    },

    min: {

      neatline: {
        src: ['<config:concat.neatline.src>'],
        dest: build+'neatline.js',
        separator: ';'
      },

      editor: {
        src: ['<config:concat.editor.src>'],
        dest: build+'editor.js',
        separator: ';'
      }

    },

    watch: {
      neatline: {
        files: ['<config:concat.neatline.src>'],
        tasks: ['concat:poem']
      },
      editor: {
        files: ['<config:concat.editor.src>'],
        tasks: ['concat:admin']
      }
    }

  });

};
