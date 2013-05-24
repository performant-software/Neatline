<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


if (!defined('NL_DIR')) define('NL_DIR', dirname(__FILE__));

// PLUGIN
require_once NL_DIR . '/NeatlinePlugin.php';

// MIGRATIONS
require_once NL_DIR.'/migrations/abstract/NeatlineMigration_Abstract.php';
require_once NL_DIR.'/migrations/NeatlineMigration_20alpha2.php';

// MODELS
require_once NL_DIR.'/models/abstract/Neatline_Row_Abstract.php';
require_once NL_DIR.'/models/abstract/Neatline_Row_Expandable.php';
require_once NL_DIR.'/models/abstract/Neatline_Row_Expansion.php';
require_once NL_DIR.'/models/abstract/Neatline_Table_Expandable.php';
require_once NL_DIR.'/models/abstract/Neatline_Table_Expansion.php';

// CONTROLLERS
require_once NL_DIR.'/controllers/abstract/Neatline_RestController.php';

// BACKGROUND JOBS
require_once NL_DIR.'/jobs/Neatline_ImportItems.php';

// ACL ASSERTIONS
require_once NL_DIR.'/acl/ExhibitOrRecordOwnership.php';

// FORMS
require_once NL_DIR.'/forms/ExhibitForm.php';

// HELPERS
require_once NL_DIR.'/helpers/Acl.php';
require_once NL_DIR.'/helpers/Assets.php';
require_once NL_DIR.'/helpers/Globals.php';
require_once NL_DIR.'/helpers/jobs.php';
require_once NL_DIR.'/helpers/Layers.php';
require_once NL_DIR.'/helpers/Plugins.php';
require_once NL_DIR.'/helpers/Styles.php';
require_once NL_DIR.'/helpers/Views.php';

// Register layers JSON and PUT path.
Zend_Registry::set('layers', NL_DIR . '/layers.json');
Zend_Registry::set('fileIn', 'php://input');

// Start plugin.
$neatline = new NeatlinePlugin();
$neatline->setUp();
