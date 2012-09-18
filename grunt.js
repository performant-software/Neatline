/*
 * Grunt file.
 */

module.exports = function(grunt) {

  // File prefixes.
  var app = 'views/shared/javascripts/';
  var util = 'views/shared/javascripts/utilities/';
  var lib = 'views/shared/javascripts/libraries/';
  var build = 'views/shared/javascripts/payloads/';

  grunt.initConfig({

    concat: {

      'public': {
        src: [
          lib+'utilities.js',
          lib+'jquery.getscrollbarwidth.js',
          lib+'openlayers/Openlayers.min.js',
          lib+'tile.stamen.js',
          lib+'simile/timeline-api/timeline-api.js',
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
        src: [],
        dest: ''
      }

    },

    min: {

      'public': {
        src: ['<config:concat.public.src>'],
        dest: build+'neatline.js'
      },

      editor: {
        src: [],
        dest: ''
      }

    },

    watch: {
      'public': {
        files: ['<config:concat.public.src>'],
        tasks: ['concat:poem']
      },
      editor: {
        files: ['<config:concat.editor.src>'],
        tasks: ['concat:admin']
      }
    }

  });

};
