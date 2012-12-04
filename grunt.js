
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Grunt file.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

// Load configuration.
var yaml = require('yaml-config');
var path = '/views/shared/javascripts/config.yaml';
var c = yaml.readConfig(process.cwd()+path);
var _ = require('underscore');

module.exports = function(grunt) {

  // Load custom tasks.
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-stylus');

  // Create vendor file array.
  var vendorFiles = _.map(c.js.lib, function(v,k) {
    return c.vendor+v;
  });

  // css => styl.
  var stylusFiles = {};
  _.each(c.css.stylus.mappings, function(v,k) {
    stylusFiles[c.css.payload+v] = c.css.stylus.source+k;
  });

  grunt.initConfig({

    concat: {

      neatline: {
        src: vendorFiles.concat([
          c.app+'app.js',
          c.app+'map/**/*.js'
        ]),
        dest: c.js.payload+'neatline.js',
        separator: ';'
      },

      editor: {
        src: vendorFiles.concat([
          c.app+'app.js',
          c.app+'map/**/*.js',
          c.app+'editor/**/*.js'
        ]),
        dest: c.js.payload+'editor.js',
        separator: ';'
      },

      neatlineCss: {
        src: [
          c.css.payload+'neatline.css',
          c.vendor+c.css.lib.openlayers,
          c.vendor+c.css.lib.bootstrap
        ],
        dest: c.css.payload+'neatline.css'
      },

      editorCss: {
        src: [
          '<config:concat.neatlineCss.src>',
          c.css.payload+'overrides.css',
          c.css.payload+'editor.css'
        ],
        dest: c.css.payload+'editor.css'
      }

    },

    min: {

      neatline: {
        src: ['<config:concat.neatline.src>'],
        dest: c.js.payload+'neatline.js',
        separator: ';'
      },

      editor: {
        src: ['<config:concat.editor.src>'],
        dest: c.js.payload+'editor.js',
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
        c.css.stylus.source+'/*.styl'
      ],
      tasks: [
        'concat:neatline',
        'concat:editor',
        'stylus',
        'concat:neatlineCss',
        'concat:editorCss'
      ]
    }

  });

};
