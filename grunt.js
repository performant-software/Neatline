
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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-shell');

  // Load configuration.
  var config = grunt.file.readJSON('./config.json');

  grunt.initConfig({

    shell: {

      // NPM
      npm_jasmine: {
        command: 'npm install',
        stdout: true,
        execOptions: {
          cwd: config.jasmine
        }
      },

      // BOWER
      bower_cache_clean: {
        command: 'rm -rf ~/.bower',
        stdout: true,
        execOptions: {
          cwd: config.bower.app
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

      // LIB
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

      // TEST
      phpunit: {
        command: 'phpunit --color',
        stdout: true,
        execOptions: {
          cwd: './tests'
        }
      },
      jasmine_public: {
        command: 'grunt --config gruntPublic.js jasmine',
        stdout: true,
        execOptions: {
          cwd: config.jasmine
        }
      },
      jasmine_public_server: {
        command: 'grunt --config gruntPublic.js jasmine-server',
        stdout: true,
        execOptions: {
          cwd: config.jasmine
        }
      },
      jasmine_editor: {
        command: 'grunt --config gruntEditor.js jasmine',
        stdout: true,
        execOptions: {
          cwd: config.jasmine
        }
      },
      jasmine_editor_server: {
        command: 'grunt --config gruntEditor.js jasmine-server',
        stdout: true,
        execOptions: {
          cwd: config.jasmine
        }
      }

    },

    clean: {
      npm: [
        config.jasmine+'/node_modules',
      ],
      bower: [
        config.bower.app+'/components',
        config.bower.tests+'/components'
      ],
      payload: [
        config.payloads.app.css,
        config.payloads.app.js,
        config.payloads.test.root
      ]
    },

    concat: {
      neatline: {
        src: [

          // Vendor:
          config.vendor.js.jquery,
          config.vendor.js.underscore,
          config.vendor.js.backbone,
          config.vendor.js.marionette,
          config.vendor.js.neatline,
          config.vendor.js.openlayers,
          config.vendor.js.rivets,
          config.vendor.js.d3,

          // Neatline:
          config.app+'/*.js',
          config.app+'/shared/record/record.model.js',
          config.app+'/shared/record/record.collection.js',
          config.app+'/map/**/*.js',
          config.app+'/bubble/**/*.js'

        ],
        dest: config.payloads.app.js+'/neatline.js',
        separator: ';'
      },
      editor: {
        src: [

          // Vendor:
          config.vendor.js.jquery,
          config.vendor.js.underscore,
          config.vendor.js.underscore_s,
          config.vendor.js.backbone,
          config.vendor.js.marionette,
          config.vendor.js.neatline,
          config.vendor.js.openlayers,
          config.vendor.js.routefilter,
          config.vendor.js.toastr,
          config.vendor.js.bootstrap,
          config.vendor.js.rivets,
          config.vendor.js.d3,

          // Neatline:
          config.app+'/*.js',
          config.app+'/shared/record/record.model.js',
          config.app+'/shared/record/record.collection.js',
          config.app+'/map/**/*.js',
          config.app+'/bubble/**/*.js',

          // Editor:
          config.app+'/editor/shared/tag/tag.model.js',
          config.app+'/editor/shared/tag/tag.collection.js',
          config.app+'/editor/*.js',
          config.app+'/editor/map/*.js',
          config.app+'/editor/menu/*.js',
          config.app+'/editor/record/*.js',
          config.app+'/editor/records/*.js',
          config.app+'/editor/search/*.js',
          config.app+'/editor/styles/*.js'

        ],
        dest: config.payloads.app.js+'/editor.js',
        separator: ';'
      },
      neatline_css: {
        src: [
          config.payloads.app.css+'/public/*.css',
          config.vendor.css.openlayers,
        ],
        dest: config.payloads.app.css+'/neatline.css',
      },
      editor_css: {
        src: [
          '<config:concat.neatline_css.src>',
          config.vendor.css.bootstrap,
          config.vendor.css.toastr,
          config.payloads.app.css+'/editor/*.css'
        ],
        dest: config.payloads.app.css+'/editor.css',
      }
    },

    min: {
      neatline: {
        src: '<config:concat.neatline.src>',
        dest: config.payloads.app.js+'/neatline.js',
        separator: ';'
      },
      editor: {
        src: '<config:concat.editor.src>',
        dest: config.payloads.app.js+'/editor.js',
        separator: ';'
      }
    },

    stylus: {
      compile: {
        options: {
          paths: [config.stylus]
        },
        files: {
          './views/shared/css/payloads/*.css': [
            config.stylus+'/public/*.styl',
            config.stylus+'/editor/*.styl'
          ]
        }
      }
    },

    rig: {
      jasmine: {
        src: config.jasmine+'/helpers/_helpers.js',
        dest: config.jasmine+'/helpers/helpers.js',
      }
    },

    copy: {
      jasmine: {
        files: {
          './views/shared/javascripts/tests/payloads/js/':
          './views/shared/javascripts/payloads/*.js',
          './views/shared/javascripts/tests/payloads/css/':
          './views/shared/css/payloads/*.css'
        }
      }
    },

    watch: {
      payload: {
        files: [
          '<config:concat.neatline.src>',
          '<config:concat.editor.src>',
          config.stylus+'/**/*.styl',
          config.jasmine+'/helpers/*.js'
        ],
        tasks: [
          'compile:concat'
        ]
      },
      jasmine: {
        files: [
          '<config:concat.neatline.src>',
          '<config:concat.editor.src>',
          config.stylus+'/**/*.styl',
          config.jasmine+'/helpers/*.js',
          config.jasmine+'/tests/**/*.js'
        ],
        tasks: [
          'compile:concat',
          'jasmine'
        ]
      }
    }

  });


  // Task aliases.
  // -------------

  // Default task.
  grunt.registerTask('default', 'test');

  // Assemble static assets.
  grunt.registerTask('compile:concat', [
    'clean:payload',
    'concat:neatline',
    'concat:editor',
    'stylus',
    'concat:neatline_css',
    'concat:editor_css',
    'copy',
    'rig'
  ]);

  // Assemble/min static assets.
  grunt.registerTask('compile:min', [
    'clean:payload',
    'min:neatline',
    'min:editor',
    'stylus',
    'concat:neatline_css',
    'concat:editor_css',
    'copy',
    'rig'
  ]);

  // Build the application.
  grunt.registerTask('build', [
    'clean',
    'shell:npm_jasmine',
    'shell:bower_cache_clean',
    'shell:bower_app',
    'shell:bower_tests',
    'shell:build_openlayers',
    'shell:build_bootstrap',
    'shell:move_bootstrap_images',
    'compile:min'
  ]);

  // Run all tests.
  grunt.registerTask('test', [
    'shell:phpunit',
    'shell:jasmine_public',
    'shell:jasmine_editor'
  ]);

  // Run PHPUnit.
  grunt.registerTask('phpunit', 'shell:phpunit');

  // Run Jasmine.
  grunt.registerTask('jasmine', [
    'shell:jasmine_public',
    'shell:jasmine_editor'
  ]);
  grunt.registerTask(
    'jasmine:public',
    'shell:jasmine_public'
  );
  grunt.registerTask(
    'jasmine:public:server',
    'shell:jasmine_public_server'
  );
  grunt.registerTask(
    'jasmine:editor',
    'shell:jasmine_editor'
  );
  grunt.registerTask(
    'jasmine:editor:server',
    'shell:jasmine_editor_server'
  );


};
