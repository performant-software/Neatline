
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Neatline Jasmine runner.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-jasmine-runner');
  grunt.initConfig({
    jasmine: {
      src: 'shared/payloads/js/neatline.js',
      specs: [
        'integration/**/*.spec.js',
        'unit/**/*.spec.js'
      ],
      helpers: [
        'shared/helpers/*.js',
        'shared/helpers/components/jasmine-jquery/lib/jasmine-jquery.js',
        'shared/helpers/components/sinon.js/sinon.js'
      ],
      server: {
        port: 1337
      }
    }
  });
};
