
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
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

      bower_clean: {
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

      build_jquery_ui: {
        command: 'npm install && grunt build',
        options: {
          execOptions: {
            cwd: cfg.build.jquery_ui
          }
        }
      },

      build_sinon: {
        command: './build',
        options: {
          execOptions: {
            cwd: cfg.build.sinon
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
      },

      jquery_ui: {
        files: [{
          src: cfg.build.jquery_ui+'/dist/images/*',
          dest: cfg.payloads.shared.css+'/images',
          expand: true,
          flatten: true
        }]
      },

      colorpicker: {
        files: [{
          src: cfg.build.colorpicker+'/images/*',
          dest: cfg.payloads.shared.css+'/images',
          expand: true,
          flatten: true
        }]
      }

    },

    clean: {
      payloads: [
        cfg.payloads.shared.js,
        cfg.payloads.shared.css,
        cfg.payloads.admin.js,
        cfg.payloads.admin.css
      ],
      fixtures: [
        cfg.jasmine+'/fixtures/*.json',
        cfg.jasmine+'/fixtures/*.html',
        cfg.jasmine+'/fixtures/*.xml'
      ],
      images: './views/shared/css/img',
      bower: './components'
    },

    concat: {

      exhibit_form: {
        src: [
          cfg.vendor.js.chosen,
          cfg.vendor.js.underscore_s,
          cfg.src.admin+'/exhibit.form.js'
        ],
        dest: cfg.payloads.admin.js+'/exhibit-form.js'
      },

      neatline_public: {
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
          cfg.src.shared+'/shared/exhibit/exhibit.model.js',
          cfg.src.shared+'/shared/record/record.model.js',
          cfg.src.shared+'/shared/record/record.collection.js',
          cfg.src.shared+'/shared/widget/*.js',
          cfg.src.shared+'/map/**/*.js',
          cfg.src.shared+'/presenter/*.js',
          cfg.src.shared+'/presenter/None/*.js',
          cfg.src.shared+'/presenter/StaticBubble/*.js'

        ],
        dest: cfg.payloads.shared.js+'/neatline-public.js'
      },

      neatline_editor: {
        src: [

          // Vendor:
          cfg.vendor.js.jquery,
          cfg.vendor.js.jquery_ui,
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
          cfg.vendor.js.wysihtml5_parser,
          cfg.vendor.js.wysihtml5_lib,
          cfg.vendor.js.spectrum,
          cfg.vendor.js.bootstrap,
          cfg.vendor.js.ace,
          cfg.vendor.js.ace_theme,
          cfg.vendor.js.ace_mode,
          cfg.vendor.js.rivets,

          // Neatline:
          cfg.src.shared+'/*.js',
          cfg.src.shared+'/shared/exhibit/exhibit.model.js',
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
        dest: cfg.payloads.shared.js+'/neatline-editor.js'
      },

      exhibit_form_css: {
        src: [
          cfg.vendor.css.chosen,
          cfg.payloads.admin.css+'/exhibit-form.css'
        ],
        dest: cfg.payloads.admin.css+'/exhibit-form.css'
      },

      neatline_public_css: {
        src: [
          cfg.vendor.css.openlayers,
          cfg.payloads.shared.css+'/neatline-public.css'
        ],
        dest: cfg.payloads.shared.css+'/neatline-public.css'
      },

      neatline_editor_css: {
        src: [
          cfg.vendor.css.jquery_ui,
          cfg.vendor.css.bootstrap,
          cfg.vendor.css.toastr,
          cfg.vendor.css.spectrum,
          cfg.vendor.css.chosen,
          '<%= concat.neatline_public_css.src %>',
          cfg.payloads.shared.css+'/neatline-editor.css'
        ],
        dest: cfg.payloads.shared.css+'/neatline-editor.css'
      }

    },

    uglify: {

      exhibit_form: {
        src: '<%= concat.exhibit_form.src %>',
        dest: cfg.payloads.admin.js+'/exhibit-form.js'
      },

      neatline_public: {
        src: '<%= concat.neatline_public.src %>',
        dest: cfg.payloads.shared.js+'/neatline-public.js'
      },

      neatline_editor: {
        src: '<%= concat.neatline_editor.src %>',
        dest: cfg.payloads.shared.js+'/neatline-editor.js'
      }

    },

    stylus: {

      compile: {
        options: {
          paths: [cfg.stylus.shared]
        },
        files: {
          './views/shared/css/payloads/neatline-public.css':
            cfg.stylus.shared+'/public/*.styl',
          './views/shared/css/payloads/neatline-editor.css':
            cfg.stylus.shared+'/editor/*.styl',
          './views/admin/css/payloads/exhibit-form.css':
            cfg.stylus.admin+'/exhibit-form.styl'
        }
      }

    },

    watch: {

      payload: {
        files: [
          '<%= concat.exhibit_form.src %>',
          '<%= concat.neatline_public.src %>',
          '<%= concat.neatline_editor.src %>',
          cfg.stylus.admin+'/**/*.styl',
          cfg.stylus.shared+'/**/*.styl'
        ],
        tasks: [
          'compile:concat'
        ]
      }

    },

    jasmine: {

      options: {
        helpers: [
          cfg.vendor.js.jasmine_jquery,
          cfg.vendor.js.jasmine_async,
          cfg.vendor.js.sinon,
          cfg.jasmine+'/helpers/*.js',
          cfg.jasmine+'/assertions/*.js'
        ]
      },

      neatline: {
        src: cfg.payloads.shared.js+'/neatline-public.js',
        options: {
          specs: cfg.jasmine+'/suites/public/**/*.spec.js'
        }
      },

      editor: {
        src: cfg.payloads.shared.js+'/neatline-editor.js',
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

  // Default task.
  grunt.registerTask('default', 'test');

  // Build the application.
  grunt.registerTask('build', [
    'clean',
    'shell:bower_clean',
    'shell:bower_install',
    'shell:build_openlayers',
    'shell:build_bootstrap',
    'shell:build_jquery_ui',
    'shell:build_sinon',
    'compile',
    'copy'
  ]);

  // Assemble static assets.
  grunt.registerTask('compile', [
    'concat:exhibit_form',
    'concat:neatline_public',
    'concat:neatline_editor',
    'stylus',
    'concat:exhibit_form_css',
    'concat:neatline_public_css',
    'concat:neatline_editor_css'
  ]);

  // Assemble/min static assets.
  grunt.registerTask('compile:min', [
    'uglify:exhibit_form',
    'uglify:neatline_public',
    'uglify:neatline_editor',
    'stylus',
    'concat:exhibit_form_css',
    'concat:neatline_public_css',
    'concat:neatline_editor_css'
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
