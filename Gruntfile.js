
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Gruntfile.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');

  var cfg = grunt.file.readJSON('./config.json');

  grunt.initConfig({

    shell: {
      options: {
        stdout: true
      },
      bower_cache_clean: {
        command: 'rm -rf ~/.bower && bower cache-clean'
      },
      bower_install: {
        command: 'bower install'
      },
      build_openlayers: {
        command: 'python build.py full OpenLayers.js',
        options: {
          execOptions: {
            cwd: cfg.build.openlayers
          }
        }
      },
      build_bootstrap: {
        command: 'npm install && make bootstrap',
        options: {
          execOptions: {
            cwd: cfg.build.bootstrap
          }
        }
      },
      phpunit: {
        command: 'phpunit --color',
        options: {
          execOptions: {
            cwd: './tests/phpunit'
          }
        }
      }
    },

    copy: {
      bootstrap: {
        files: [{
          src: cfg.build.bootstrap+'/img/*',
          dest: './views/shared/css/img/',
          expand: true,
          flatten: true
        }]
      },
      chosen: {
        files: [{
          src: cfg.build.chosen+'/chosen-sprite.png',
          dest: cfg.payloads.admin.css,
          expand: true,
          flatten: true
        }]
      }
    },

    clean: {
      bower: './components',
      images: './views/shared/css/img',
      payloads: [
        cfg.payloads.shared.js,
        cfg.payloads.shared.css,
        cfg.payloads.admin.js,
        cfg.payloads.admin.css
      ]
    },

    concat: {
      form: {
        src: [
          cfg.vendor.js.chosen,
          cfg.vendor.js.underscore_s,
          cfg.src.admin+'/*.js'
        ],
        dest: cfg.payloads.admin.js+'/form.js'
      },
      neatline: {
        src: [

          // Vendor:
          cfg.vendor.js.jquery,
          cfg.vendor.js.underscore,
          cfg.vendor.js.underscore_s,
          cfg.vendor.js.backbone,
          cfg.vendor.js.marionette,
          cfg.vendor.js.neatline,
          cfg.vendor.js.safesync,
          cfg.vendor.js.openlayers,
          cfg.vendor.js.stamen,
          cfg.vendor.js.rivets,

          // Neatline:
          cfg.src.shared+'/*.js',
          cfg.src.shared+'/shared/record/record.model.js',
          cfg.src.shared+'/shared/record/record.collection.js',
          cfg.src.shared+'/shared/widget/*.js',
          cfg.src.shared+'/map/**/*.js',
          cfg.src.shared+'/presenter/*.js',
          cfg.src.shared+'/presenter/None/*.js',
          cfg.src.shared+'/presenter/StaticBubble/*.js'

        ],
        dest: cfg.payloads.shared.js+'/neatline.js'
      },
      editor: {
        options: {
          separator: ';'
        },
        src: [

          // Vendor:
          cfg.vendor.js.jquery,
          cfg.vendor.js.underscore,
          cfg.vendor.js.underscore_s,
          cfg.vendor.js.backbone,
          cfg.vendor.js.marionette,
          cfg.vendor.js.neatline,
          cfg.vendor.js.openlayers,
          cfg.vendor.js.stamen,
          cfg.vendor.js.svgtowkt,
          cfg.vendor.js.routefilter,
          cfg.vendor.js.draggable,
          cfg.vendor.js.toastr,
          cfg.vendor.js.chosen,
          cfg.vendor.js.bootstrap,
          cfg.vendor.js.ace,
          cfg.vendor.js.ace_theme,
          cfg.vendor.js.ace_mode,
          cfg.vendor.js.rivets,

          // Neatline:
          cfg.src.shared+'/*.js',
          cfg.src.shared+'/shared/record/record.model.js',
          cfg.src.shared+'/shared/record/record.collection.js',
          cfg.src.shared+'/shared/widget/*.js',
          cfg.src.shared+'/map/**/*.js',
          cfg.src.shared+'/presenter/*.js',
          cfg.src.shared+'/presenter/None/*.js',
          cfg.src.shared+'/presenter/StaticBubble/*.js',

          // Editor:
          cfg.src.shared+'/editor/*.js',
          cfg.src.shared+'/editor/exhibit/**/*.js',
          cfg.src.shared+'/editor/record/**/*.js',
          cfg.src.shared+'/editor/map/*.js',

        ],
        dest: cfg.payloads.shared.js+'/editor.js'
      },
      form_css: {
        src: [
          cfg.vendor.css.chosen,
          cfg.payloads.admin.css+'/form/*.css'
        ],
        dest: cfg.payloads.admin.css+'/form.css'
      },
      neatline_css: {
        src: [
          cfg.vendor.css.openlayers,
          cfg.payloads.shared.css+'/public/*.css'
        ],
        dest: cfg.payloads.shared.css+'/neatline.css'
      },
      editor_css: {
        src: [
          '<%= concat.neatline_css.src %>',
          cfg.vendor.css.bootstrap,
          cfg.vendor.css.toastr,
          cfg.vendor.css.chosen,
          cfg.vendor.css.codemirror,
          cfg.payloads.shared.css+'/editor/*.css'
        ],
        dest: cfg.payloads.shared.css+'/editor.css'
      }
    },

    uglify: {
      form: {
        src: '<%= concat.form.src %>',
        dest: cfg.payloads.admin.js+'/form.js'
      },
      neatline: {
        src: '<%= concat.neatline.src %>',
        dest: cfg.payloads.shared.js+'/neatline.js'
      },
      editor: {
        src: '<%= concat.editor.src %>',
        dest: cfg.payloads.shared.js+'/editor.js'
      }
    },

    stylus: {
      compile: {
        options: {
          paths: [cfg.stylus.shared]
        },
        files: {
          './views/shared/css/payloads/public/*.css':
            cfg.stylus.shared+'/public/*.styl',
          './views/shared/css/payloads/editor/*.css':
            cfg.stylus.shared+'/editor/*.styl',
          './views/admin/css/payloads/form/*.css':
            cfg.stylus.admin+'/form/*.styl'
        }
      }
    },

    watch: {
      payload: {
        files: [
          '<%= concat.form.src %>',
          '<%= concat.neatline.src %>',
          '<%= concat.editor.src %>',
          cfg.stylus.admin+'/**/*.styl',
          cfg.stylus.shared+'/**/*.styl',
          cfg.jasmine+'/helpers/*.js'
        ],
        tasks: [
          'compile:concat'
        ]
      }
    },

    jasmine: {
      options: {
        helpers: [
          cfg.jasmine+'/helpers/*.js',
          cfg.vendor.js.jasmine_jquery,
          cfg.vendor.js.sinon
        ]
      },
      neatline: {
        src: cfg.payloads.shared.js+'/neatline.js',
        options: {
          specs: cfg.jasmine+'/suites/public/**/*.spec.js'
        }
      },
      editor: {
        src: cfg.payloads.shared.js+'/editor.js',
        options: {
          specs: cfg.jasmine+'/suites/editor/**/*.spec.js'
        }
      }
    },

    connect: {
      server: {
        options: {
          keepalive: true,
          port: 1337
        }
      }
    }

  });


  // Task aliases.
  // -------------

  // Default task.
  grunt.registerTask('default', 'test');

  // Assemble static assets.
  grunt.registerTask('compile', [
    'concat:form',
    'concat:neatline',
    'concat:editor',
    'stylus',
    'concat:form_css',
    'concat:neatline_css',
    'concat:editor_css'
  ]);

  // Assemble/min static assets.
  grunt.registerTask('compile:min', [
    'uglify:form',
    'uglify:neatline',
    'uglify:editor',
    'stylus',
    'concat:form_css',
    'concat:neatline_css',
    'concat:editor_css'
  ]);

  // Build the application.
  grunt.registerTask('build', [
    'clean',
    'shell:bower_cache_clean',
    'shell:bower_install',
    'shell:build_openlayers',
    'shell:build_bootstrap',
    'compile',
    'copy'
  ]);

  // Run all tests.
  grunt.registerTask('test', [
    'shell:phpunit',
    'jasmine'
  ]);

  // Run PHPUnit.
  grunt.registerTask('phpunit', 'shell:phpunit');

  // Build and mount public Jasmine suite.
  grunt.registerTask('jasmine:neatline:server', [
    'jasmine:neatline:build',
    'connect'
  ]);

  // Build and mount editor Jasmine suite.
  grunt.registerTask('jasmine:editor:server', [
    'jasmine:editor:build',
    'connect'
  ]);


};
