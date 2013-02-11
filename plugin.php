<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Plugin runner.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


if (!defined('NL_DIR')) define('NL_DIR', dirname(__FILE__));

require_once NL_DIR . '/NeatlinePlugin.php';
require_once NL_DIR . '/components/spyc/Spyc.php';
require_once NL_DIR . '/controllers/abstract/NeatlineRestController.php';
require_once NL_DIR . '/models/abstract/NeatlineAbstractRecord.php';
require_once NL_DIR . '/helpers/NeatlineFunctions.php';
require_once NL_DIR . '/forms/ExhibitForm.php';

Zend_Registry::set('fileIn', 'php://input');

$neatline = new NeatlinePlugin();
$neatline->setUp();
