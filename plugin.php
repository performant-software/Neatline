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

$paths = array(
    NL_DIR . '/models/abstract/*.php',
    NL_DIR . '/controllers/abstract/*.php',
    NL_DIR . '/jobs/*.php',
    NL_DIR . '/helpers/*.php',
    NL_DIR . '/forms/*.php'
);

foreach ($paths as $path) {
    foreach (glob($path) as $file) {
        require_once $file;
    }
}

Zend_Registry::set('layers', NL_DIR . '/layers.json');
Zend_Registry::set('fileIn', 'php://input');

$neatline = new NeatlinePlugin();
$neatline->setUp();
