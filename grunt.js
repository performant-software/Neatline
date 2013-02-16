
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

      // BOWER
      bower_cache_clean: {
        command: 'rm -rf ~/.bower',
        stdout: true
      },
      bower_install: {
        command: 'bower install',
        stdout: true
      },

      // BUILD
      build_openlayers: {
        command: 'python build.py full OpenLayers.js',
        stdout: true,
        execOptions: {
          cwd: config.build.openlayers
        }
      },
      build_bootstrap: {
        command: 'npm install && make bootstrap',
        stdout: true,
        execOptions: {
          cwd: config.build.bootstrap
        }
      },
      move_bootstrap_images: {
        command: 'cp -r ' + config.build.bootstrap + '/img ' +
          './views/shared/css/img',
        stdout: true
      },
      move_chosen_images: {
        command: 'cp ' + config.build.chosen+'/chosen-sprite.png ' +
          config.payloads.admin.css,
        stdout: true
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
      bower: './components',
      images: './views/shared/css/img',
      payloads: [
        config.payloads.shared.js,
        config.payloads.shared.css,
        config.payloads.admin.js,
        config.payloads.admin.css
      ],
      jasmine: [
        config.jasmine+'/payloads',
        config.jasmine+'/node_modules',
        config.jasmine+'/components'
      ]
    },

    concat: {
      form: {
        src: [
          config.vendor.js.chosen,
          config.vendor.js.underscore_s,
          config.src.admin+'/*.js'
        ],
        dest: config.payloads.admin.js+'/form.js',
        separator: ';'
      },
      neatline: {
        src: [

          // Vendor:
          config.vendor.js.jquery,
          config.vendor.js.underscore,
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
        dest: config.payloads.shared.js+'/neatline.js',
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
          config.src.shared+'/editor/map/*.js',
          config.src.shared+'/editor/menu/*.js',
          config.src.shared+'/editor/record/*.js',
          config.src.shared+'/editor/records/*.js',
          config.src.shared+'/editor/search/*.js',
          config.src.shared+'/editor/styles/*.js',
          config.src.shared+'/editor/exhibit/*.js'

        ],
        dest: config.payloads.shared.js+'/editor.js',
        separator: ';'
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
          '<config:concat.neatline_css.src>',
          config.vendor.css.bootstrap,
          config.vendor.css.toastr,
          config.vendor.css.chosen,
          config.vendor.css.codemirror,
          config.payloads.shared.css+'/editor/*.css'
        ],
        dest: config.payloads.shared.css+'/editor.css'
      }
    },

    min: {
      form: {
        src: '<config:concat.form.src>',
        dest: config.payloads.admin.js+'/form.js',
        separator: ';'
      },
      neatline: {
        src: '<config:concat.neatline.src>',
        dest: config.payloads.shared.js+'/neatline.js',
        separator: ';'
      },
      editor: {
        src: '<config:concat.editor.src>',
        dest: config.payloads.shared.js+'/editor.js',
        separator: ';'
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

    rig: {
      jasmine: {
        src: config.jasmine+'/helpers/_helpers.js',
        dest: config.jasmine+'/helpers/helpers.js'
      }
    },

    copy: {
      build: {
        files: [
          {
            src: './components/**',
            dest: config.jasmine+'/components/'
          },
          {
            src: './node_modules/**',
            dest: config.jasmine+'/node_modules/'
          }
        ]
      },
      payload: {
        files: [
          {
            src: config.payloads.shared.js+'/*.js',
            dest: config.jasmine+'/payloads/js/'
          },
          {
            src: config.payloads.shared.css+'/*.css',
            dest: config.jasmine+'/payloads/css/'
          }
        ]
      }
    },

    watch: {
      payload: {
        files: [
          '<config:concat.form.src>',
          '<config:concat.neatline.src>',
          '<config:concat.editor.src>',
          config.stylus.admin+'/**/*.styl',
          config.stylus.shared+'/**/*.styl',
          config.jasmine+'/helpers/*.js'
        ],
        tasks: [
          'compile:concat'
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
    'concat:form',
    'concat:neatline',
    'concat:editor',
    'stylus',
    'concat:form_css',
    'concat:neatline_css',
    'concat:editor_css',
    'copy:payload',
    'rig'
  ]);

  // Assemble/min static assets.
  grunt.registerTask('compile:min', [
    'min:form',
    'min:neatline',
    'min:editor',
    'stylus',
    'concat:form_css',
    'concat:neatline_css',
    'concat:editor_css',
    'copy:payload',
    'rig'
  ]);

  // Build the application.
  grunt.registerTask('build', [
    'clean',
    'shell:bower_cache_clean',
    'shell:bower_install',
    'shell:build_openlayers',
    'shell:build_bootstrap',
    'compile:min',
    'shell:move_bootstrap_images',
    'shell:move_chosen_images',
    'copy:build'
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
