
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80: */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = function(grunt) {


  // File utilities:
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-markdown');

  // Directory utilities:
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-symlink');

  // Test runners:
  grunt.loadNpmTasks('grunt-phpunit');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Filesystem helpers:
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Config files:
  var pkg = grunt.file.readJSON('package.json');
  var paths = grunt.file.readJSON('paths.json');


  grunt.initConfig({

    bower: {
      install: {
        options: { copy: false }
      }
    },

    copy: {

      bootstrap: {
        files: [{
          src: paths.copy.bootstrap+'/dist/fonts/*',
          dest: 'views/shared/css/fonts/',
          flatten: true,
          expand: true
        }]
      },

      openlayers: {
        files: [{
          src: paths.copy.openlayers+'/dark/*',
          dest: 'views/shared/images/dark',
          flatten: true,
          expand: true
        }]
      },

      chosen: {
        files: [{
          src: paths.copy.chosen+'/*.png',
          dest: paths.payloads.css.admin,
          flatten: true,
          expand: true
        }]
      },

      jquery_ui: {
        files: [{
          src: paths.copy.jquery_ui+'/themes/smoothness/images/*',
          dest: paths.payloads.css.shared+'/images',
          flatten: true,
          expand: true
        }]
      },

      select2: {
        files: [{
          src: [
            paths.copy.select2+'/*.png',
            paths.copy.select2+'/*.gif'
          ],
          dest: paths.payloads.css.shared,
          flatten: true,
          expand: true
        }]
      },

      ckeditor: {
        files: [{
          cwd: paths.copy.ckeditor,
          src: '**',
          dest: paths.payloads.js.shared+'/ckeditor/',
          expand: true
        }]
      }

    },

    symlink: {

      options: {
        overwrite: true
      },

      hook: {
        src: 'pre-commit',
        dest: '.git/hooks/pre-commit'
      }

    },

    clean: {

      payloads: [
        paths.payloads.js.shared,
        paths.payloads.css.shared,
        paths.payloads.js.admin,
        paths.payloads.css.admin
      ],

      fixtures: [
        paths.jasmine+'/fixtures/*.json',
        paths.jasmine+'/fixtures/*.html',
        paths.jasmine+'/fixtures/*.xml'
      ],

      bower:  'bower_components',
      fonts:  'views/shared/css/fonts',
      images: 'views/shared/images',
      hook:   '.git/hooks/pre-commit',
      dist:   'pkg'

    },

    concat: {

      add_form: {
        src: [
          paths.vendor.js.underscore_s,
          paths.vendor.js.chosen,
          paths.src.js.admin+'/exhibit-form.js',
          paths.src.js.admin+'/slug-autogen.js'
        ],
        dest: paths.payloads.js.admin+'/add-form.js'
      },

      edit_form: {
        src: [
          paths.vendor.js.chosen,
          paths.src.js.admin+'/exhibit-form.js'
        ],
        dest: paths.payloads.js.admin+'/edit-form.js'
      },

      neatline_public: {
        src: [

          // Vendor:
          paths.vendor.js.jquery,
          paths.vendor.js.jquery_ui,
          paths.vendor.js.underscore,
          paths.vendor.js.underscore_s,
          paths.vendor.js.backbone,
          paths.vendor.js.mutators,
          paths.vendor.js.schema,
          paths.vendor.js.marionette,
          paths.vendor.js.safesync,
          paths.vendor.js.openlayers,
          paths.vendor.js.openlayers_geo,
          paths.vendor.js.stamen,
          paths.vendor.js.rivets,

          // Neatline:
          paths.src.js.shared+'/*.js',
          paths.src.js.shared+'/shared/*.js',
          paths.src.js.shared+'/shared/exhibit/exhibit.model.js',
          paths.src.js.shared+'/shared/record/record.model.js',
          paths.src.js.shared+'/shared/record/record.collection.js',
          paths.src.js.shared+'/shared/widget/*.js',
          paths.src.js.shared+'/broker/*.js',
          paths.src.js.shared+'/map/**/*.js',
          paths.src.js.shared+'/presenter/*.js',
          paths.src.js.shared+'/presenter/StaticBubble/*.js',
          paths.src.js.shared+'/presenter/None/*.js'

        ],
        dest: paths.payloads.js.shared+'/neatline-public.js'
      },

      neatline_editor: {
        src: [

          // Vendor:
          paths.vendor.js.jquery,
          paths.vendor.js.jquery_ui,
          paths.vendor.js.underscore,
          paths.vendor.js.underscore_s,
          paths.vendor.js.backbone,
          paths.vendor.js.routefilter,
          paths.vendor.js.mutators,
          paths.vendor.js.schema,
          paths.vendor.js.marionette,
          paths.vendor.js.openlayers,
          paths.vendor.js.openlayers_geo,
          paths.vendor.js.stamen,
          paths.vendor.js.rivets,
          paths.vendor.js.svgtowkt,
          paths.vendor.js.draggable,
          paths.vendor.js.toastr,
          paths.vendor.js.spectrum,
          paths.vendor.js.bootstrap,
          paths.vendor.js.ace,
          paths.vendor.js.ace_theme,
          paths.vendor.js.ace_mode,
          paths.vendor.js.select2,
          paths.vendor.js.uri,

          // Neatline:
          paths.src.js.shared+'/*.js',
          paths.src.js.shared+'/shared/*.js',
          paths.src.js.shared+'/shared/exhibit/exhibit.model.js',
          paths.src.js.shared+'/shared/record/record.model.js',
          paths.src.js.shared+'/shared/record/record.collection.js',
          paths.src.js.shared+'/shared/widget/*.js',
          paths.src.js.shared+'/broker/*.js',
          paths.src.js.shared+'/map/**/*.js',
          paths.src.js.shared+'/presenter/*.js',
          paths.src.js.shared+'/presenter/StaticBubble/*.js',
          paths.src.js.shared+'/presenter/None/*.js',

          // Editor:
          paths.src.js.shared+'/editor/*.js',
          paths.src.js.shared+'/editor/exhibit/**/*.js',
          paths.src.js.shared+'/editor/record/**/*.js',
          paths.src.js.shared+'/editor/map/*.js',

        ],
        dest: paths.payloads.js.shared+'/neatline-editor.js'
      },

      jasmine_vendor: {
        src: [
          paths.vendor.js.uri,
          paths.vendor.js.jasmine_jquery,
          paths.vendor.js.jasmine_async,
          paths.vendor.js.sinon,
          paths.jasmine+'/assertions/*.js',
          paths.jasmine+'/helpers/*.js'
        ],
        dest: paths.jasmine+'/payloads/vendor.js'
      },

      exhibit_form_css: {
        src: [
          paths.vendor.css.chosen,
          paths.payloads.css.admin+'/exhibit-form.css'
        ],
        dest: paths.payloads.css.admin+'/exhibit-form.css'
      },

      neatline_public_css: {
        src: [
          paths.vendor.css.openlayers,
          paths.payloads.css.shared+'/neatline-public.css'
        ],
        dest: paths.payloads.css.shared+'/neatline-public.css'
      },

      neatline_editor_css: {
        src: [
          paths.vendor.css.jquery_ui,
          paths.vendor.css.bootstrap,
          paths.vendor.css.toastr,
          paths.vendor.css.spectrum,
          paths.vendor.css.select2,
          paths.vendor.css.select2_bs,
          '<%= concat.neatline_public_css.src %>',
          paths.payloads.css.shared+'/neatline-editor.css'
        ],
        dest: paths.payloads.css.shared+'/neatline-editor.css'
      }

    },

    uglify: {

      options: {
        beautify: {
          quote_keys: true // Fixes Select2 breakage in PhantomJS.
        }
      },

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

    stylus: {

      options: {
        paths: [paths.src.styl.shared],
        import: ['var']
      },

      neatline_public: {
        src: paths.src.styl.shared+'/public/**/*.styl',
        dest: paths.payloads.css.shared+'/neatline-public.css'
      },

      neatline_editor: {
        src: paths.src.styl.shared+'/editor/**/*.styl',
        dest: paths.payloads.css.shared+'/neatline-editor.css'
      },

      exhibit_form: {
        src: paths.src.styl.admin+'/exhibit-form.styl',
        dest: paths.payloads.css.admin+'/exhibit-form.css'
      }

    },

    cssmin: {

      admin: {
        src: '*.css',
        cwd: paths.payloads.css.admin,
        dest: paths.payloads.css.admin,
        expand: true
      },

      shared: {
        src: '*.css',
        dest: paths.payloads.css.shared,
        cwd: paths.payloads.css.shared,
        expand: true
      }

    },

    markdown: {

      options: {
        template: 'docs/template.html',
      },

      docs: {
        src: 'docs/markdown/*.md',
        dest: 'docs/html/',
        ext: '.html',
        flatten: true,
        expand: true
      }

    },

    watch: {

      payload: {
        files: [
          '<%= concat.add_form.src %>',
          '<%= concat.edit_form.src %>',
          '<%= concat.neatline_public.src %>',
          '<%= concat.neatline_editor.src %>',
          '<%= concat.jasmine_vendor.src %>',
          '<%= stylus.neatline_public.src %>',
          '<%= stylus.neatline_editor.src %>',
          '<%= stylus.exhibit_form.src %>',
        ],
        tasks: 'compile'
      }

    },

    phpunit: {

      options: {
        bin: 'vendor/bin/phpunit',
        bootstrap: 'tests/phpunit/bootstrap.php',
        followOutput: true,
        colors: true
      },

      application: {
        dir: 'tests/phpunit',
        options: {
          configuration: 'tests/phpunit/phpunit-application.xml'
        }
      },

      features: {
        dir: 'tests/phpunit',
        options: {
          configuration: 'tests/phpunit/phpunit-features.xml'
        }
      }

    },

    jasmine: {

      options: {
        template: paths.jasmine+'/runner.tmpl',
        helpers: paths.jasmine+'/payloads/vendor.js'
      },

      neatline: {
        src: paths.payloads.js.shared+'/neatline-public.js',
        options: {
          specs: paths.jasmine+'/tests/neatline/**/*.spec.js'
        }
      },

      editor: {
        src: [
          paths.payloads.js.shared+'/ckeditor/ckeditor.js',
          paths.payloads.js.shared+'/neatline-editor.js'
        ],
        options: {
          specs: paths.jasmine+'/tests/editor/**/*.spec.js'
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

    }

  });


  // Run the tests by default.
  grunt.registerTask('default', 'test');

  // Build the application.
  grunt.registerTask('build', [
    'clean',
    'bower',
    'compile:min',
    'copy',
    'symlink'
  ]);

  // Concat static assets.
  grunt.registerTask('compile', [
    'stylus',
    'concat'
  ]);

  // Minify static assets.
  grunt.registerTask('compile:min', [
    'compile',
    'uglify',
    'cssmin'
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

  // Run all tests.
  grunt.registerTask('test', [
    'compile:min',
    'clean:fixtures',
    'phpunit',
    'jasmine'
  ]);

  // Spawn release package.
  grunt.registerTask('package', [
    'clean:dist',
    'compile:min',
    'compress'
  ]);


};
