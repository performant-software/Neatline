
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-shell');

  var pkg = grunt.file.readJSON('package.json');
  var paths = grunt.file.readJSON('paths.json');

  grunt.initConfig({

    bower: {
      install: {
        options: {
          copy: false
        }
      }
    },

    shell: {

      options: {
        stdout: true
      },

      build_openlayers: {
        command: 'python build.py full OpenLayers.js',
        options: {
          execOptions: {
            cwd: paths.build.openlayers
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

      build_chosen: {
        command: 'npm install && bundle install && grunt build',
        options: {
          execOptions: {
            cwd: paths.build.chosen
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

      phpunit_application: {
        command: '../../vendor/bin/phpunit -c phpunit-application.xml',
        options: {
          execOptions: {
            cwd: 'tests/phpunit'
          }
        }
      },

      phpunit_migrations: {
        command: '../../vendor/bin/phpunit -c phpunit-migrations.xml',
        options: {
          execOptions: {
            cwd: 'tests/phpunit'
          }
        }
      }

    },

    copy: {

      bootstrap: {
        files: [{
          src: paths.build.bootstrap+'/fonts/*',
          dest: 'views/shared/css/fonts/',
          expand: true,
          flatten: true
        }]
      },

      chosen: {
        files: [{
          src: paths.build.chosen+'/public/*.png',
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

      bower: 'bower_components',
      fonts: 'views/shared/css/fonts',
      pkg: 'pkg'

    },

    concat: {

      add_form: {
        src: [
          paths.vendor.js.chosen,
          paths.vendor.js.underscore_s,
          paths.src.admin+'/exhibit-form.js',
          paths.src.admin+'/slug-autogen.js'
        ],
        dest: paths.payloads.admin.js+'/add-form.js'
      },

      edit_form: {
        src: [
          paths.vendor.js.chosen,
          paths.src.admin+'/exhibit-form.js'
        ],
        dest: paths.payloads.admin.js+'/edit-form.js'
      },

      neatline_public: {
        src: [

          // Vendor:
          paths.vendor.js.jquery,
          paths.vendor.js.jquery_ui,
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

      add_form: {
        src: '<%= concat.add_form.dest %>',
        dest: '<%= concat.add_form.dest %>'
      },

      edit_form: {
        src: '<%= concat.edit_form.dest %>',
        dest: '<%= concat.edit_form.dest %>'
      },

      neatline_public: {
        src: '<%= concat.neatline_public.dest %>',
        dest: '<%= concat.neatline_public.dest %>'
      },

      neatline_editor: {
        src: '<%= concat.neatline_editor.dest %>',
        dest: '<%= concat.neatline_editor.dest %>'
      }

    },

    cssmin: {

      admin: {
        cwd: paths.payloads.admin.css,
        dest: paths.payloads.admin.css,
        expand: true,
        src: '*.css'
      },

      shared: {
        cwd: paths.payloads.shared.css,
        dest: paths.payloads.shared.css,
        expand: true,
        src: '*.css'
      }

    },

    stylus: {

      compile: {
        options: {
          paths: [paths.stylus.shared]
        },
        files: {
          'views/shared/css/payloads/neatline-public.css':
            paths.stylus.shared+'/public/**/*.styl',
          'views/shared/css/payloads/neatline-editor.css':
            paths.stylus.shared+'/editor/**/*.styl',
          'views/admin/css/payloads/exhibit-form.css':
            paths.stylus.admin+'/exhibit-form.styl'
        }
      }

    },

    watch: {

      payload: {
        files: [
          '<%= concat.add_form.src %>',
          '<%= concat.edit_form.src %>',
          '<%= concat.neatline_public.src %>',
          '<%= concat.neatline_editor.src %>',
          paths.stylus.admin+'/**/*.styl',
          paths.stylus.shared+'/**/*.styl'
        ],
        tasks: 'compile:concat'
      }

    },

    compress: {

      dist: {
        options: {
          archive: 'pkg/Neatline-'+pkg.version+'.zip'
        },
        dest: 'Neatline/',
        src: [

          '**',

          // GIT
          '!.git/**',

          // BOWER
          '!bower.json',
          '!bower_components/**',

          // NPM
          '!package.json',
          '!node_modules/**',

          // COMPOSER
          '!composer.json',
          '!composer.lock',
          '!vendor/**',

          // RUBY
          '!Gemfile',
          '!Gemfile.lock',
          '!Rakefile',

          // GRUNT
          '!.grunt/**',
          '!Gruntfile.js',
          '!paths.json',

          // DIST
          '!pkg/**',

          // TESTS
          '!tests/**'

        ]
      }

    },

    jasmine: {

      options: {
        template: paths.jasmine+'/runner.tmpl',
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
          specs: [
            paths.jasmine+'/integration/neatline/**/*.spec.js',
            paths.jasmine+'/unit/neatline/**/*.spec.js'
          ]
        }
      },

      editor: {
        src: [
          paths.payloads.shared.js+'/ckeditor/ckeditor.js',
          paths.payloads.shared.js+'/neatline-editor.js'
        ],
        options: {
          specs: [
            paths.jasmine+'/integration/editor/**/*.spec.js'
          ]
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

  // Run application tests.
  grunt.registerTask('default', 'test');

  // Build the application.
  grunt.registerTask('build', [
    'clean',
    'bower',
    'shell:build_openlayers',
    'shell:build_ckeditor',
    'shell:build_jquery_ui',
    'shell:build_chosen',
    'shell:build_sinon',
    'compile',
    'copy'
  ]);

  // Concat static assets.
  grunt.registerTask('compile', [
    'concat:add_form',
    'concat:edit_form',
    'concat:neatline_public',
    'concat:neatline_editor',
    'stylus',
    'concat:exhibit_form_css',
    'concat:neatline_public_css',
    'concat:neatline_editor_css'
  ]);

  // Minify static assets.
  grunt.registerTask('compile:min', [
    'compile',
    'uglify',
    'cssmin'
  ]);

  // Run default PHPUnit suite.
  grunt.registerTask('phpunit', [
    'shell:phpunit_application'
  ]);

  // Run migrations PHPUnit suite.
  grunt.registerTask('phpunit:migrations', [
    'shell:phpunit_migrations'
  ]);

  // Run all PHPUnit suites.
  grunt.registerTask('phpunit:all', [
    'shell:phpunit_application',
    'shell:phpunit_migrations'
  ]);

  // Mount public Jasmine suite.
  grunt.registerTask('jasmine:neatline:server', [
    'jasmine:neatline:build',
    'connect'
  ]);

  // Mount editor Jasmine suite.
  grunt.registerTask('jasmine:editor:server', [
    'jasmine:editor:build',
    'connect'
  ]);

  // Run application tests.
  grunt.registerTask('test', [
    'clean:fixtures',
    'phpunit:all',
    'jasmine'
  ]);

  // Spawn release package.
  grunt.registerTask('package', [
    'compile:min',
    'clean:pkg',
    'compress'
  ]);

};
