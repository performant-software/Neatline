
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = {

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

};
