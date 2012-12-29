
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Grunt file.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = function(grunt) {

  // Load custom tasks.
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');

  // Load configuration.
  var config = grunt.file.readJSON('./config.json');

  grunt.initConfig({

    shell: {

      npm_tests_map: {
        command: 'npm install',
        stdout: true,
        execOptions: {
          cwd: config.jasmine.neatline
        }
      },
      npm_tests_editor: {
        command: 'npm install',
        stdout: true,
        execOptions: {
          cwd: config.jasmine.editor
        }
      },

      bower_app: {
        command: 'bower install',
        stdout: true,
        execOptions: {
          cwd: config.bower.app
        }
      },
      bower_tests: {
        command: 'bower install',
        stdout: true,
        execOptions: {
          cwd: config.bower.tests
        }
      },

      build_openlayers: {
        command: 'python build.py full OpenLayers.js',
        stdout: true,
        execOptions: {
          cwd: config.build.openlayers
        }
      },
      build_bootstrap: {
        command: 'make bootstrap',
        stdout: true,
        execOptions: {
          cwd: config.build.bootstrap
        }
      },
      move_bootstrap_images: {
        command: 'cp -r img ../../../css/img',
        stdout: true,
        execOptions: {
          cwd: config.build.bootstrap
        }
      },

      phpunit: {
        command: 'phpunit --color',
        stdout: true,
        execOptions: {
          cwd: './tests'
        }
      },
      jasmine_public: {
        command: 'grunt jasmine',
        stdout: true,
        execOptions: {
          cwd: config.jasmine['public']
        }
      },
      jasmine_public_server: {
        command: 'grunt jasmine-server',
        stdout: true,
        execOptions: {
          cwd: config.jasmine['public']
        }
      },
      jasmine_editor: {
        command: 'grunt jasmine',
        stdout: true,
        execOptions: {
          cwd: config.jasmine.editor
        }
      },
      jasmine_editor_server: {
        command: 'grunt jasmine-server',
        stdout: true,
        execOptions: {
          cwd: config.jasmine.editor
        }
      }

    },

    clean: {
      npm: [
        config.jasmine['public']+'/node_modules',
        config.jasmine.editor+'/node_modules'
      ],
      bower: [
        config.bower.app+'/components',
        config.bower.tests+'/components'
      ],
      payload: [
        config.payloads.css,
        config.payloads.js
      ]
    },

    concat: {
      neatline: {
        src: [

          // Vendor:
          config.vendor.js.jquery,
          config.vendor.js.underscore,
          config.vendor.js.backbone,
          config.vendor.js.eventbinder,
          config.vendor.js.wreqr,
          config.vendor.js.marionette,
          config.vendor.js.neatline,
          config.vendor.js.openlayers,
          config.vendor.js.bootstrap,
          config.vendor.js.d3,

          // Neatline:
          config.app+'/app.js',
          config.app+'/record/record.model.js',
          config.app+'/record/record.collection.js',
          config.app+'/map/**/*.js',
          config.app+'/bubble/**/*.js'

        ],
        dest: config.payloads.js+'/neatline.js',
        separator: ';'
      },
      editor: {
        src: [

          // Vendor:
          config.vendor.js.jquery,
          config.vendor.js.underscore,
          config.vendor.js.underscore_s,
          config.vendor.js.backbone,
          config.vendor.js.eventbinder,
          config.vendor.js.wreqr,
          config.vendor.js.marionette,
          config.vendor.js.neatline,
          config.vendor.js.openlayers,
          config.vendor.js.bootstrap,
          config.vendor.js.noty,
          config.vendor.js.noty_layout_base,
          config.vendor.js.noty_layout,
          config.vendor.js.noty_theme,
          config.vendor.js.d3,

          // Editor:
          config.app+'/app.js',
          config.app+'/record/record.model.js',
          config.app+'/record/record.collection.js',
          config.app+'/map/**/*.js',
          config.app+'/bubble/**/*.js',
          config.app+'/editor/**/*.js'

        ],
        dest: config.payloads.js+'/editor.js',
        separator: ';'
      },
      neatline_css: {
        src: [
          config.payloads.css+'/public/*.css',
          config.vendor.css.openlayers,
          config.vendor.css.bootstrap
        ],
        dest: config.payloads.css+'/neatline.css'
      },
      editor_css: {
        src: [
          '<config:concat.neatline_css.src>',
          config.payloads.css+'/editor/*.css'
        ],
        dest: config.payloads.css+'/editor.css'
      }
    },

    min: {
      neatline: {
        src: ['<config:concat.neatline.src>'],
        dest: config.payloads.js+'/neatline.js',
        separator: ';'
      },
      editor: {
        src: ['<config:concat.editor.src>'],
        dest: config.payloads.js+'/editor.js',
        separator: ';'
      }
    },

    stylus: {
      compile: {
        options: {
          paths: [config.stylus]
        },
        files: {
          'views/shared/css/payloads/*.css': [
            config.stylus+'/public/*.styl',
            config.stylus+'/editor/*.styl'
          ]
        }
      }
    },

    watch: {
      payload: {
        files: [
          '<config:concat.neatline.src>',
          '<config:concat.editor.src>',
          config.stylus+'/**/*.styl'
        ],
        tasks: [
          'concat:neatline',
          'concat:editor',
          'stylus',
          'concat:neatline_css',
          'concat:editor_css'
        ]
      }
    }

  });


  // Task aliases.
  // -------------

  // Default task.
  grunt.registerTask('default', 'test');

  // Build the application.
  grunt.registerTask('build', [
    'clean',
    'shell:npm_tests_map',
    'shell:npm_tests_editor',
    'shell:bower_app',
    'shell:bower_tests',
    'shell:build_openlayers',
    'shell:build_bootstrap',
    'shell:move_bootstrap_images',
    'min:neatline',
    'min:editor',
    'stylus',
    'concat:neatline_css',
    'concat:editor_css'
  ]);

  // Run all tests.
  grunt.registerTask('test', [
    'shell:phpunit',
    'shell:jasmine_public',
    'shell:jasmine_editor'
  ]);

  // Run PHPUnit / Jasmine.
  grunt.registerTask('phpunit', 'shell:phpunit');
  grunt.registerTask('jasmine', [
    'shell:jasmine_public',
    'shell:jasmine_editor'
  ]);

  // Run Jasmine servers.
  grunt.registerTask('public_server', 'shell:jasmine_public_server');
  grunt.registerTask('editor_server', 'shell:jasmine_editor_server');


};
