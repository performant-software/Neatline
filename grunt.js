/*
 * Grunt file.
 */

// Get package configuration.
var config = require('yaml-config');
var c = config.readConfig('views/shared/javascripts/v2/config.yaml');

module.exports = function(grunt) {

  // Load tasks.
  grunt.loadNpmTasks('grunt-css');

  var vendor = [
    c.components+c.vendor.jquery,
    c.components+c.vendor.underscore,
    c.components+c.vendor.backbone,
    c.components+c.vendor.marionette,
    c.components+c.vendor.d3
  ];

  var app =       'views/shared/javascripts/';
  var util =      'views/shared/javascripts/utilities/';
  var lib =       'views/shared/javascripts/libraries/';
  var buildjs =   'views/shared/javascripts/v2/payloads/';
  var buildcss =  'views/shared/css/payloads/';
  var edit =      'views/shared/javascripts/editor/';
  var css =       'views/shared/css/';
  var eutil =     edit+'utilities/';

  grunt.initConfig({

    concat: {

      neatline: {
        src: [
          lib+'utilities.js',
          lib+'jquery.getscrollbarwidth.js',
          lib+'openlayers/OpenLayers.min.js',
          lib+'tile.stamen.js',
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
        dest: buildjs+'neatline.js'
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
          lib+'minicolors/jquery.miniColors.min.js'
        ],
        dest: buildjs+'editor.js'
      },

      v2neatline: {
        src: vendor.concat([
          c.apps.neatline+'**/*.js'
        ]),
        dest: c.payload+'neatline.js',
        separator: ';'
      },

      v2editor: {

      }

    },

    min: {

      neatline: {
        src: ['<config:concat.neatline.src>'],
        dest: buildjs+'neatline.js',
        separator: ';'
      },

      editor: {
        src: ['<config:concat.editor.src>'],
        dest: buildjs+'editor.js',
        separator: ';'
      },

      v2neatline: {
        src: ['<config:concat.v2neatline.src>'],
        dest: c.payload+'neatline.js',
        separator: ';'
      },

      v2editor: {

      }

    },

    cssmin: {

      neatline: {
        src: [
          css+'neatline.css',
          css+'neatline-timeline.css'
        ],
        dest: buildcss+'neatline.css'
      },

      editor: {
        src: [
          css+'neatline-editor.css',
          css+'neatline-fullscreen.css',
          css+'gradient-builder.css',
          css+'configure-layout.css',
          css+'configure-map.css',
          css+'configure-timeline.css',
          css+'configure-items.css',
          css+'jquery.miniColors.css'
        ],
        dest: buildcss+'editor.css'
      }

    },

    watch: {
      neatline: {
        files: ['<config:concat.v2neatline.src>'],
        tasks: ['concat:v2neatline']
      }
    }

  });

};
