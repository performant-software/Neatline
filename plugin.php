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


if (!defined('NEATLINE_PLUGIN_DIR'))
    define('NEATLINE_PLUGIN_DIR', dirname(__FILE__));

require_once NEATLINE_PLUGIN_DIR . '/NeatlinePlugin.php';
require_once NEATLINE_PLUGIN_DIR . '/helpers/NeatlineFunctions.php';
require_once NEATLINE_PLUGIN_DIR . '/forms/NeatlineDetails.php';

Zend_Registry::set('fileIn', 'php://input');

$neatline = new NeatlinePlugin();
$neatline->setUp();
