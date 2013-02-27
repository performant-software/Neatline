
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

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');

  // Load configuration.
  var config = grunt.file.readJSON('./config.json');

  grunt.initConfig({

    shell: {
      options: {
        stdout: true
      },
      bower_cache_clean: {
        command: 'rm -rf ~/.bower'
      },
      bower_install: {
        command: 'bower install'
      },
      build_openlayers: {
        command: 'python build.py full OpenLayers.js',
        options: {
          execOptions: {
            cwd: config.build.openlayers
          }
        }
      },
      build_bootstrap: {
        command: 'npm install && make bootstrap',
        options: {
          execOptions: {
            cwd: config.build.bootstrap
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
          src: config.build.bootstrap+'/img/*',
          dest: './views/shared/css/img/',
          expand: true,
          flatten: true
        }]
      },
      chosen: {
        files: [{
          src: config.build.chosen+'/chosen-sprite.png',
          dest: config.payloads.admin.css,
          expand: true,
          flatten: true
        }]
      }
    },

    clean: {
      bower: './components',
      images: './views/shared/css/img',
      payloads: [
        config.payloads.shared.js,
        config.payloads.shared.css,
        config.payloads.admin.js,
        config.payloads.admin.css
      ]
    },

    concat: {
      form: {
        src: [
          config.vendor.js.chosen,
          config.vendor.js.underscore_s,
          config.src.admin+'/*.js'
        ],
        dest: config.payloads.admin.js+'/form.js'
      },
      neatline: {
        src: [

          // Vendor:
          config.vendor.js.jquery,
          config.vendor.js.underscore,
          config.vendor.js.underscore_s,
          config.vendor.js.backbone,
          config.vendor.js.marionette,
          config.vendor.js.neatline,
          config.vendor.js.safesync,
          config.vendor.js.openlayers,
          config.vendor.js.stamen,
          config.vendor.js.rivets,

          // Neatline:
          config.src.shared+'/*.js',
          config.src.shared+'/shared/record/record.model.js',
          config.src.shared+'/shared/record/record.collection.js',
          config.src.shared+'/map/**/*.js',
          config.src.shared+'/presenter/*.js',
          config.src.shared+'/presenter/None/*.js',
          config.src.shared+'/presenter/StaticBubble/*.js'

        ],
        dest: config.payloads.shared.js+'/neatline.js'
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
          config.vendor.js.stamen,
          config.vendor.js.svgtowkt,
          config.vendor.js.routefilter,
          config.vendor.js.toastr,
          config.vendor.js.draggable,
          config.vendor.js.chosen,
          config.vendor.js.bootstrap,
          config.vendor.js.rivets,
          config.vendor.js.codemirror,
          config.vendor.js.codemirror_yaml,

          // Neatline:
          config.src.shared+'/*.js',
          config.src.shared+'/shared/record/record.model.js',
          config.src.shared+'/shared/record/record.collection.js',
          config.src.shared+'/map/**/*.js',
          config.src.shared+'/presenter/*.js',
          config.src.shared+'/presenter/None/*.js',
          config.src.shared+'/presenter/StaticBubble/*.js',

          // Editor:
          config.src.shared+'/editor/*.js',
          config.src.shared+'/editor/shared/**/*.js',
          config.src.shared+'/editor/exhibit/**/*.js',
          config.src.shared+'/editor/record/**/*.js',
          config.src.shared+'/editor/map/*.js',

        ],
        dest: config.payloads.shared.js+'/editor.js'
      },
      form_css: {
        src: [
          config.vendor.css.chosen,
          config.payloads.admin.css+'/form/*.css'
        ],
        dest: config.payloads.admin.css+'/form.css'
      },
      neatline_css: {
        src: [
          config.vendor.css.openlayers,
          config.payloads.shared.css+'/public/*.css'
        ],
        dest: config.payloads.shared.css+'/neatline.css'
      },
      editor_css: {
        src: [
          config.vendor.css.bootstrap,
          config.vendor.css.toastr,
          config.vendor.css.chosen,
          config.vendor.css.codemirror,
          '<%= concat.neatline_css.src %>',
          config.payloads.shared.css+'/editor/*.css'
        ],
        dest: config.payloads.shared.css+'/editor.css'
      }
    },

    uglify: {
      options: {
        separator: ';'
      },
      form: {
        src: '<%= concat.form.src %>',
        dest: config.payloads.admin.js+'/form.js'
      },
      neatline: {
        src: '<%= concat.neatline.src %>',
        dest: config.payloads.shared.js+'/neatline.js'
      },
      editor: {
        src: '<%= concat.editor.src %>',
        dest: config.payloads.shared.js+'/editor.js'
      }
    },

    stylus: {
      compile: {
        options: {
          paths: [config.stylus.shared]
        },
        files: {
          './views/shared/css/payloads/public/*.css':
            config.stylus.shared+'/public/*.styl',
          './views/shared/css/payloads/editor/*.css':
            config.stylus.shared+'/editor/*.styl',
          './views/admin/css/payloads/form/*.css':
            config.stylus.admin+'/form/*.styl'
        }
      }
    },

    watch: {
      payload: {
        files: [
          '<%= concat.form.src %>',
          '<%= concat.neatline.src %>',
          '<%= concat.editor.src %>',
          config.stylus.admin+'/**/*.styl',
          config.stylus.shared+'/**/*.styl',
          config.jasmine+'/helpers/*.js'
        ],
        tasks: [
          'compile:concat'
        ]
      }
    },

    jasmine: {
      options: {
        helpers: [
          config.jasmine+'/helpers/*.js',
          config.vendor.js.jasmine_jquery,
          config.vendor.js.sinon
        ]
      },
      neatline: {
        src: config.payloads.shared.js+'/neatline.js',
        options: {
          specs: config.jasmine+'/spec/public/**/*.spec.js'
        }
      },
      editor: {
        src: config.payloads.shared.js+'/editor.js',
        options: {
          specs: config.jasmine+'/spec/editor/**/*.spec.js'
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
  grunt.registerTask('compile:concat', [
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
    'compile:min',
    'copy'
  ]);

  // Run all tests.
  grunt.registerTask('test', [
    'shell:phpunit',
    'jasmine'
  ]);

  // Run PHPUnit.
  grunt.registerTask('phpunit', 'shell:phpunit');


};
