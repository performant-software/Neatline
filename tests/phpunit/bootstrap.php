<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

// Load the Omeka bootstrap.
require_once '../../../../application/tests/bootstrap.php';

// Assign directory globals.
define('NL_DIR', PLUGIN_DIR.'/Neatline');
define('NL_TEST_DIR', NL_DIR.'/tests/phpunit');

// Base test cases.
require_once NL_TEST_DIR.'/cases/Neatline_Case_Default.php';
require_once NL_TEST_DIR.'/cases/Neatline_Case_Fixture.php';
require_once NL_TEST_DIR.'/cases/Neatline_Case_Migrate.php';

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
