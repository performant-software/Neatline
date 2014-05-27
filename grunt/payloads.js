
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

require('shelljs/global');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');

module.exports = function(grunt) {

  grunt.registerTask(
    'copy-payloads',
    'Copy the /development payloads into /production.',
    function() {

      // Glob all of the /development directories.
      var devs = glob.sync(
        path.resolve(__dirname, '../views/**/dist/development')
      );

      _.each(devs, function(dev) {

        // Get the corresponding /production.
        var prod = path.dirname(dev) + '/production';

        // Empty out /production.
        rm('-rf', prod); mkdir(prod);

        // Copy /development -> /production.
        cp('-r', dev + '/**', prod);

      });

    });

};
