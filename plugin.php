<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


if (!defined('NL_DIR')) define('NL_DIR', dirname(__FILE__));

require_once NL_DIR . '/NeatlinePlugin.php';
require_once NL_DIR . '/models/abstract/Neatline_AbstractRow.php';
require_once NL_DIR . '/models/abstract/Neatline_ExpandableTable.php';
require_once NL_DIR . '/models/abstract/Neatline_ExpandableRow.php';
require_once NL_DIR . '/models/abstract/Neatline_ExpansionTable.php';
require_once NL_DIR . '/models/abstract/Neatline_ExpansionRow.php';
require_once NL_DIR . '/controllers/abstract/Neatline_RestController.php';
require_once NL_DIR . '/jobs/Neatline_ImportItems.php';
require_once NL_DIR . '/forms/ExhibitForm.php';
require_once NL_DIR . '/helpers/Assets.php';
require_once NL_DIR . '/helpers/Globals.php';
require_once NL_DIR . '/helpers/jobs.php';
require_once NL_DIR . '/helpers/Layers.php';
require_once NL_DIR . '/helpers/Plugins.php';
require_once NL_DIR . '/helpers/Styles.php';
require_once NL_DIR . '/helpers/Views.php';

Zend_Registry::set('layers', NL_DIR . '/layers.json');
Zend_Registry::set('fileIn', 'php://input');

$neatline = new NeatlinePlugin();
$neatline->setUp();
