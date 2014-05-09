
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = {

  dist: {
    options: {
      archive: 'pkg/Neatline-<%= pkg.version %>.zip'
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

};
