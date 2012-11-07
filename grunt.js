/*
 * Grunt file.
 */

// Get package configuration.
var config = require('yaml-config');
var configPath = '/views/shared/javascripts/v2/config.yaml';
var c = config.readConfig(process.cwd()+configPath);

module.exports = function(grunt) {

  // Load tasks.
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-stylus');

  // Paths.
  var js = 'views/shared/javascripts/v2/payloads/';
  var stylus = 'views/shared/css/v2/stylus/';
  var css = 'views/shared/css/v2/payloads/';

  var vendorFiles = [
    c.components+c.vendor.jquery,
    c.components+c.vendor.underscore,
    c.components+c.vendor.backbone,
    c.components+c.vendor.eventbinder,
    c.components+c.vendor.wreqr,
    c.components+c.vendor.marionette,
    c.components+c.vendor.d3
  ];

  var neatlineStylus = {};
  neatlineStylus[css+'neatline.css'] = stylus+'neatline.styl';

  grunt.initConfig({

    concat: {

      neatline: {
        src: vendorFiles.concat([
          c.apps.neatline+'app.js',
          c.apps.neatline+'run.js',
          c.apps.neatline+'collections/*.js',
          c.apps.neatline+'views/*.js',
          c.apps.neatline+'controllers/*.js'
        ]),
        dest: c.payload+'neatline.js',
        separator: ';'
      }

    },

    min: {

      neatline: {
        src: ['<config:concat.neatline.src>'],
        dest: js+'neatline.js',
        separator: ';'
      }

    },

    stylus: {
      compile: {
        options: {},
        files: neatlineStylus
      }
    },

    watch: {
      neatline: {
        files: ['<config:concat.neatline.src>'],
        tasks: ['concat:neatline', 'stylus']
      }
    }

  });

};
