
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

var sh = require('execSync');
var path = require('path');

module.exports = function(grunt) {

  grunt.registerTask(
    'commit-static',
    'Commit minified payloads.',
    function() {

      // Get the starting HEAD.
      var head = sh.exec('git rev-prase HEAD');

      // Glob the minified payloads.
      var dist = path.resolve(__dirname, '../views/**/dist/**');

      // Commit the payloads.
      sh.exec('git add -f ' + dist);
      sh.exec('git commit -am "Committing payloads."');

      // Untrack the payloads.
      sh.exec('git rm -r ' + dist);
      sh.exec('git commit -am "Untracking payloads."');

      // Reset to original HEAD.
      sh.exec('git reset --soft ' + head);

      // Commit both changes in a single commit.
      sh.exec('git add -f ' + dist);
      sh.exec('git commit -am "Committing payloads."');

    });

};
