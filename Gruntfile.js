
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

  var paths = grunt.file.readJSON('./paths.json');

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
            cwd: paths.build.openlayers
          }
        }
      },

      build_bootstrap: {
        command: 'npm install && make bootstrap',
        options: {
          execOptions: {
            cwd: paths.build.bootstrap
          }
        }
      },

      build_ckeditor: {
        command: './build.sh',
        options: {
          execOptions: {
            cwd: paths.build.ckeditor
          }
        }
      },

      build_jquery_ui: {
        command: 'npm install && grunt build',
        options: {
          execOptions: {
            cwd: paths.build.jquery_ui
          }
        }
      },

      build_sinon: {
        command: './build',
        options: {
          execOptions: {
            cwd: paths.build.sinon
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
          src: paths.build.bootstrap+'/img/*',
          dest: './views/shared/css/img/',
          expand: true,
          flatten: true
        }]
      },

      chosen: {
        files: [{
          src: paths.build.chosen+'/chosen-sprite.png',
          dest: paths.payloads.admin.css,
          expand: true,
          flatten: true
        }]
      },

      jquery_ui: {
        files: [{
          src: paths.build.jquery_ui+'/dist/images/*',
          dest: paths.payloads.shared.css+'/images',
          expand: true,
          flatten: true
        }]
      },

      ckeditor: {
        files: [{
          cwd: paths.build.ckeditor+'/release/ckeditor/',
          src: '**',
          dest: paths.payloads.shared.js+'/ckeditor/',
          expand: true
        }]
      },

      colorpicker: {
        files: [{
          src: paths.build.colorpicker+'/images/*',
          dest: paths.payloads.shared.css+'/images',
          expand: true,
          flatten: true
        }]
      }

    },

    clean: {
      payloads: [
        paths.payloads.shared.js,
        paths.payloads.shared.css,
        paths.payloads.admin.js,
        paths.payloads.admin.css
      ],
      fixtures: [
        paths.jasmine+'/fixtures/*.json',
        paths.jasmine+'/fixtures/*.html',
        paths.jasmine+'/fixtures/*.xml'
      ],
      images: './views/shared/css/img',
      bower: './components'
    },

    concat: {

      exhibit_form: {
        src: [
          paths.vendor.js.chosen,
          paths.vendor.js.underscore_s,
          paths.src.admin+'/exhibit.form.js'
        ],
        dest: paths.payloads.admin.js+'/exhibit-form.js'
      },

      neatline_public: {
        src: [

          // Vendor:
          paths.vendor.js.jquery,
          paths.vendor.js.underscore,
          paths.vendor.js.underscore_s,
          paths.vendor.js.backbone,
          paths.vendor.js.marionette,
          paths.vendor.js.neatline,
          paths.vendor.js.safesync,
          paths.vendor.js.openlayers,
          paths.vendor.js.stamen,
          paths.vendor.js.rivets,

          // Neatline:
          paths.src.shared+'/*.js',
          paths.src.shared+'/shared/exhibit/exhibit.model.js',
          paths.src.shared+'/shared/record/record.model.js',
          paths.src.shared+'/shared/record/record.collection.js',
          paths.src.shared+'/shared/widget/*.js',
          paths.src.shared+'/map/**/*.js',
          paths.src.shared+'/presenter/*.js',
          paths.src.shared+'/presenter/None/*.js',
          paths.src.shared+'/presenter/StaticBubble/*.js'

        ],
        dest: paths.payloads.shared.js+'/neatline-public.js'
      },

      neatline_editor: {
        src: [

          // Vendor:
          paths.vendor.js.jquery,
          paths.vendor.js.jquery_ui,
          paths.vendor.js.underscore,
          paths.vendor.js.underscore_s,
          paths.vendor.js.backbone,
          paths.vendor.js.marionette,
          paths.vendor.js.neatline,
          paths.vendor.js.openlayers,
          paths.vendor.js.stamen,
          paths.vendor.js.svgtowkt,
          paths.vendor.js.routefilter,
          paths.vendor.js.draggable,
          paths.vendor.js.toastr,
          paths.vendor.js.spectrum,
          paths.vendor.js.bootstrap,
          paths.vendor.js.ace,
          paths.vendor.js.ace_theme,
          paths.vendor.js.ace_mode,
          paths.vendor.js.rivets,

          // Neatline:
          paths.src.shared+'/*.js',
          paths.src.shared+'/shared/exhibit/exhibit.model.js',
          paths.src.shared+'/shared/record/record.model.js',
          paths.src.shared+'/shared/record/record.collection.js',
          paths.src.shared+'/shared/widget/*.js',
          paths.src.shared+'/map/**/*.js',
          paths.src.shared+'/presenter/*.js',
          paths.src.shared+'/presenter/None/*.js',
          paths.src.shared+'/presenter/StaticBubble/*.js',

          // Editor:
          paths.src.shared+'/editor/*.js',
          paths.src.shared+'/editor/exhibit/**/*.js',
          paths.src.shared+'/editor/record/**/*.js',
          paths.src.shared+'/editor/map/*.js',

        ],
        dest: paths.payloads.shared.js+'/neatline-editor.js'
      },

      exhibit_form_css: {
        src: [
          paths.vendor.css.chosen,
          paths.payloads.admin.css+'/exhibit-form.css'
        ],
        dest: paths.payloads.admin.css+'/exhibit-form.css'
      },

      neatline_public_css: {
        src: [
          paths.vendor.css.openlayers,
          paths.payloads.shared.css+'/neatline-public.css'
        ],
        dest: paths.payloads.shared.css+'/neatline-public.css'
      },

      neatline_editor_css: {
        src: [
          paths.vendor.css.jquery_ui,
          paths.vendor.css.bootstrap,
          paths.vendor.css.toastr,
          paths.vendor.css.spectrum,
          paths.vendor.css.chosen,
          '<%= concat.neatline_public_css.src %>',
          paths.payloads.shared.css+'/neatline-editor.css'
        ],
        dest: paths.payloads.shared.css+'/neatline-editor.css'
      }

    },

    uglify: {

      exhibit_form: {
        src: '<%= concat.exhibit_form.src %>',
        dest: paths.payloads.admin.js+'/exhibit-form.js'
      },

      neatline_public: {
        src: '<%= concat.neatline_public.src %>',
        dest: paths.payloads.shared.js+'/neatline-public.js'
      },

      neatline_editor: {
        src: '<%= concat.neatline_editor.src %>',
        dest: paths.payloads.shared.js+'/neatline-editor.js'
      }

    },

    stylus: {

      compile: {
        options: {
          paths: [paths.stylus.shared]
        },
        files: {
          './views/shared/css/payloads/neatline-public.css':
            paths.stylus.shared+'/public/**/*.styl',
          './views/shared/css/payloads/neatline-editor.css':
            paths.stylus.shared+'/editor/**/*.styl',
          './views/admin/css/payloads/exhibit-form.css':
            paths.stylus.admin+'/exhibit-form.styl'
        }
      }

    },

    watch: {

      payload: {
        files: [
          '<%= concat.exhibit_form.src %>',
          '<%= concat.neatline_public.src %>',
          '<%= concat.neatline_editor.src %>',
          paths.stylus.admin+'/**/*.styl',
          paths.stylus.shared+'/**/*.styl'
        ],
        tasks: [
          'compile:concat'
        ]
      }

    },

    jasmine: {

      options: {
        helpers: [
          paths.vendor.js.jasmine_jquery,
          paths.vendor.js.jasmine_async,
          paths.vendor.js.sinon,
          paths.jasmine+'/helpers/*.js',
          paths.jasmine+'/assertions/*.js'
        ]
      },

      neatline: {
        src: paths.payloads.shared.js+'/neatline-public.js',
        options: {
          specs: paths.jasmine+'/specs/public/**/*.spec.js'
        }
      },

      editor: {
        src: [
          paths.payloads.shared.js+'/ckeditor/ckeditor.js',
          paths.payloads.shared.js+'/neatline-editor.js'
        ],
        options: {
          specs: paths.jasmine+'/specs/editor/**/*.spec.js'
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
    'shell:build_ckeditor',
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
    'clean:fixtures',
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
