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
    c.components+c.vendor.openlayers_js,
    c.components+c.vendor.bootstrap_js,
    c.components+c.vendor.d3
  ];

  var stylusFiles = {};
  stylusFiles[css+'neatline.css'] = stylus+'neatline.styl';
  stylusFiles[css+'editor.css'] = stylus+'editor.styl';

  grunt.initConfig({

    concat: {

      neatline: {
        src: vendorFiles.concat([
          c.apps.neatline+'app.js',
          c.apps.neatline+'run.js',
          c.apps.neatline+'collections/*.js',
          c.apps.neatline+'modules/*.js',
          c.apps.neatline+'views/*.js'
        ]),
        dest: c.payload+'neatline.js',
        separator: ';'
      },

      editor: {
        src: vendorFiles.concat([
          c.apps.neatline+'app.js',
          c.apps.neatline+'collections/*.js',
          c.apps.neatline+'modules/*.js',
          c.apps.neatline+'views/*.js',
          c.apps.editor+'app.js',
          c.apps.editor+'run.js',
          c.apps.editor+'models/*.js',
          c.apps.editor+'collections/*.js',
          c.apps.editor+'modules/*.js',
          c.apps.editor+'views/*.js'
        ]),
        dest: c.payload+'editor.js',
        separator: ';'
      },

      test: {
        src: vendorFiles.concat([
          c.apps.neatline+'app.js',
          c.apps.neatline+'collections/*.js',
          c.apps.neatline+'modules/*.js',
          c.apps.neatline+'views/*.js',
          c.apps.editor+'app.js',
          c.apps.editor+'models/*.js',
          c.apps.editor+'collections/*.js',
          c.apps.editor+'modules/*.js',
          c.apps.editor+'views/*.js'
        ]),
        dest: c.payload+'test.js',
        separator: ';'
      },

      neatlineCss: {
        src: [
          css+'neatline.css',
          c.components+c.vendor.openlayers_css,
          c.components+c.vendor.bootstrap_css
        ],
        dest: css+'neatline.css'
      },

      editorCss: {
        src: [
          '<config:concat.neatlineCss.src>',
          css+'editor.css'
        ],
        dest: css+'editor.css'
      }

    },

    min: {

      neatline: {
        src: ['<config:concat.neatline.src>'],
        dest: js+'neatline.js',
        separator: ';'
      },

      editor: {
        src: ['<config:concat.editor.src>'],
        dest: js+'editor.js',
        separator: ';'
      }

    },

    stylus: {
      compile: {
        options: {},
        files: stylusFiles
      }
    },

    watch: {
      files: [
        '<config:concat.neatline.src>',
        '<config:concat.editor.src>',
        stylus+'/*.styl'
      ],
      tasks: [
        'concat:neatline',
        'concat:editor',
        'concat:test',
        'stylus',
        'concat:neatlineCss',
        'concat:editorCss'
      ]
    }

  });

};
