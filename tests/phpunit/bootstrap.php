<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


define('NL_DIR', dirname(dirname(dirname(__FILE__))));
define('NL_TEST_DIR', NL_DIR.'/tests/phpunit');
define('OMEKA_DIR', dirname(dirname(NL_DIR)));

// Load the Omeka bootstrap.
require_once OMEKA_DIR.'/application/tests/bootstrap.php';

// Generic test cases.
require_once NL_TEST_DIR.'/cases/Neatline_Case_Default.php';
require_once NL_TEST_DIR.'/cases/Neatline_Case_Migrate.php';
require_once NL_TEST_DIR.'/cases/Neatline_Case_Fixture.php';

// Mock filter callbacks.
require_once NL_TEST_DIR.'/mocks/filters.php';


//
// TODO: Is there really no better way?
//
// Manually load `Zend_Test_PHPUnit_Constraint_DomQuery`, which triggers a
// false-negative error in the suite when first required by Zend's PHPUnit
// subclasses, which don't work with PHPUnit 3.6+.
//

@require_once 'Zend/Test/PHPUnit/Constraint/DomQuery.php';
