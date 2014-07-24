
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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

      // Exclude un-minified files.
      '!views/**/dist/development/**',

      '!.git/**',

      '!bower.json',
      '!bower_components/**',

      '!package.json',
      '!node_modules/**',

      '!*.phar',
      '!composer.json',
      '!composer.lock',
      '!vendor/**',

      '!Rakefile',
      '!Gemfile',
      '!Gemfile.lock',

      '!.grunt/**',
      '!Gruntfile.js',
      '!paths.json',
      '!grunt/**',

      '!RELEASE-LIST.md',
      '!pkg/**',
      '!tests/**',
      '!setup'

    ]
  }

};
