
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = function(grunt) {


  // CONFIGURATION
  // --------------------------------------------------------------------------


  // Read configuration files:
  var paths = grunt.file.readJSON('paths.json');
  var pkg = grunt.file.readJSON('package.json');

  require('time-grunt')(grunt);

  // Load the task configurations.
  require('load-grunt-config')(grunt, {
    data: {
      paths: paths,
      pkg: pkg
    }
  });


  // TASKS
  // --------------------------------------------------------------------------


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
