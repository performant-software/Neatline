<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * PHPUnit runner.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


define('NL_DIR', dirname(dirname(dirname(__FILE__))));
define('OMEKA_DIR', dirname(dirname(NL_DIR)));
define('NL_TEST_DIR', NL_DIR.'/tests/phpunit');

// Bootstrap Omeka.
require_once OMEKA_DIR.'/application/tests/bootstrap.php';

// Generic test cases.
require_once 'cases/Neatline_Case_Abstract.php';
require_once 'cases/Neatline_Case_Default.php';
require_once 'cases/Neatline_Case_Features.php';
require_once 'cases/Neatline_Case_Fixture.php';

// Migration test cases.
require_once 'migrations/2.0.0/cases/Neatline_Case_Migrate200.php';

// Mock filter callbacks.
require_once 'mocks/filters.php';

// TODO: Is there really no better way?
//
// Manually load `Zend_Test_PHPUnit_Constraint_DomQuery`, which triggers a
// false-negative error in the suite when first required by Zend's PHPUnit
// subclasses, which don't work with PHPUnit 3.6+.

@require_once 'Zend/Test/PHPUnit/Constraint/DomQuery.php';
