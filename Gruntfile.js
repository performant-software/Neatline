
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80: */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = function(grunt) {


  require('load-grunt-tasks')(grunt);

  // Read configuration files:
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
          dest: paths.dist.css.admin,
          flatten: true,
          expand: true
        }]
      },

      jquery_ui: {
        files: [{
          src: paths.copy.jquery_ui+'/themes/smoothness/images/*',
          dest: paths.dist.css.shared+'/images',
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
          dest: paths.dist.css.shared,
          flatten: true,
          expand: true
        }]
      },

      ckeditor: {
        files: [{
          cwd: paths.copy.ckeditor,
          src: '**',
          dest: paths.dist.js.shared+'/ckeditor/',
          expand: true
        }]
      }

    },

    clean: {

      dist: [
        paths.dist.js.shared,
        paths.dist.css.shared,
        paths.dist.js.admin,
        paths.dist.css.admin
      ],

      fixtures: [
        paths.jasmine+'/fixtures/*.json',
        paths.jasmine+'/fixtures/*.html',
        paths.jasmine+'/fixtures/*.xml'
      ],

      bower:  'bower_components',
      fonts:  'views/shared/css/fonts',
      images: 'views/shared/images',
      dist:   'pkg'

    },

    concat: {

      add_form: {
        src: [
          paths.vendor.underscore_s,
          paths.vendor.chosen,
          paths.src.js.admin+'/exhibit-form.js',
          paths.src.js.admin+'/slug-autogen.js'
        ],
        dest: paths.dist.js.admin+'/add-form.js'
      },

      edit_form: {
        src: [
          paths.vendor.chosen,
          paths.src.js.admin+'/exhibit-form.js'
        ],
        dest: paths.dist.js.admin+'/edit-form.js'
      },

      neatline_public: {
        src: [

          // Vendor:
          paths.vendor.jquery,
          paths.vendor.jquery_ui,
          paths.vendor.underscore,
          paths.vendor.underscore_s,
          paths.vendor.backbone,
          paths.vendor.mutators,
          paths.vendor.schema,
          paths.vendor.marionette,
          paths.vendor.safesync,
          paths.vendor.openlayers,
          paths.vendor.openlayers_geo,
          paths.vendor.stamen,
          paths.vendor.rivets,

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
        dest: paths.dist.js.shared+'/neatline-public.js'
      },

      neatline_editor: {
        src: [

          // Vendor:
          paths.vendor.jquery,
          paths.vendor.jquery_ui,
          paths.vendor.underscore,
          paths.vendor.underscore_s,
          paths.vendor.backbone,
          paths.vendor.routefilter,
          paths.vendor.mutators,
          paths.vendor.schema,
          paths.vendor.marionette,
          paths.vendor.openlayers,
          paths.vendor.openlayers_geo,
          paths.vendor.stamen,
          paths.vendor.rivets,
          paths.vendor.svgtowkt,
          paths.vendor.draggable,
          paths.vendor.toastr,
          paths.vendor.spectrum,
          paths.vendor.bootstrap,
          paths.vendor.ace,
          paths.vendor.ace_theme,
          paths.vendor.ace_mode,
          paths.vendor.select2,
          paths.vendor.uri,

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
        dest: paths.dist.js.shared+'/neatline-editor.js'
      },

      jasmine_vendor: {
        src: [
          paths.vendor.uri,
          paths.vendor.jasmine_jquery,
          paths.vendor.jasmine_async,
          paths.vendor.sinon,
          paths.jasmine+'/assertions/*.js',
          paths.jasmine+'/helpers/*.js'
        ],
        dest: paths.jasmine+'/dist/vendor.js'
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
        'include css': true,
        paths: [paths.src.styl.shared, 'bower_components'],
        import: ['var']
      },

      neatline_public: {
        src: paths.src.styl.shared+'/public.styl',
        dest: paths.dist.css.shared+'/neatline-public.css'
      },

      neatline_editor: {
        src: paths.src.styl.shared+'/editor.styl',
        dest: paths.dist.css.shared+'/neatline-editor.css'
      },

      exhibit_form: {
        src: paths.src.styl.admin+'/exhibit-form.styl',
        dest: paths.dist.css.admin+'/exhibit-form.css'
      }

    },

    cssmin: {

      admin: {
        src: '*.css',
        cwd: paths.dist.css.admin,
        dest: paths.dist.css.admin,
        expand: true
      },

      shared: {
        src: '*.css',
        dest: paths.dist.css.shared,
        cwd: paths.dist.css.shared,
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
        helpers: paths.jasmine+'/dist/vendor.js'
      },

      neatline: {
        src: paths.dist.js.shared+'/neatline-public.js',
        options: {
          specs: paths.jasmine+'/tests/neatline/**/*.spec.js'
        }
      },

      editor: {
        src: [
          paths.dist.js.shared+'/ckeditor/ckeditor.js',
          paths.dist.js.shared+'/neatline-editor.js'
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
    'copy'
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
