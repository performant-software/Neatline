<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * PHPUnit runner.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


// Get Omeka root.
if (!($omeka = getenv('OMEKA_DIR'))) {
    $omeka = dirname(dirname(dirname(dirname(dirname(__FILE__)))));
}

// Omeka and Neatline.
require_once $omeka . '/application/tests/bootstrap.php';
require_once dirname(__FILE__) . '/../../NeatlinePlugin.php';

// Abstract cases and mock filters.
require_once 'Neatline_AbstractTestCase.php';
require_once 'Neatline_TestCase.php';
require_once 'mocks/filters.php';
