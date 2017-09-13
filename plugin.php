<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


if (!defined('NL_DIR')) define('NL_DIR', dirname(__FILE__));

// Plugin:
require_once NL_DIR.'/NeatlinePlugin.php';

// Models:
require_once NL_DIR.'/models/abstract/Neatline_Row_Abstract.php';
require_once NL_DIR.'/models/abstract/Neatline_Row_Expandable.php';
require_once NL_DIR.'/models/abstract/Neatline_Row_Expansion.php';
require_once NL_DIR.'/models/abstract/Neatline_Table_Expandable.php';
require_once NL_DIR.'/models/abstract/Neatline_Table_Expansion.php';

// Migrations:
require_once NL_DIR.'/migrations/abstract/Neatline_Migration_Abstract.php';
require_once NL_DIR.'/migrations/2.0.2/Neatline_Migration_202.php';
require_once NL_DIR.'/migrations/2.1.2/Neatline_Migration_212.php';
require_once NL_DIR.'/migrations/2.2.0/Neatline_Migration_220.php';
require_once NL_DIR.'/migrations/2.4.3/Neatline_Migration_243.php';
require_once NL_DIR.'/migrations/2.5.2/Neatline_Migration_252.php';
require_once NL_DIR.'/migrations/2.6.0/Neatline_Migration_260.php';

// Helper classes:
require_once NL_DIR.'/jobs/Neatline_Job_ImportItems.php';
require_once NL_DIR.'/jobs/Neatline_Job_DuplicateRecords.php';
require_once NL_DIR.'/controllers/abstract/Neatline_Controller_Rest.php';
require_once NL_DIR.'/assertions/Neatline_Acl_Assert_RecordOwnership.php';
require_once NL_DIR.'/forms/Neatline_Form_Exhibit.php';

// Helper functions:
require_once NL_DIR.'/helpers/Acl.php';
require_once NL_DIR.'/helpers/Assets.php';
require_once NL_DIR.'/helpers/Coverage.php';
require_once NL_DIR.'/helpers/Globals.php';
require_once NL_DIR.'/helpers/Layers.php';
require_once NL_DIR.'/helpers/Mysql.php';
require_once NL_DIR.'/helpers/Plugins.php';
require_once NL_DIR.'/helpers/Schemas.php';
require_once NL_DIR.'/helpers/Strings.php';
require_once NL_DIR.'/helpers/Styles.php';
require_once NL_DIR.'/helpers/Validators.php';
require_once NL_DIR.'/helpers/Views.php';

// Vendor:
require_once(NL_DIR.'/lib/geoPHP/geoPHP.inc');

// Set the PUT source.
Zend_Registry::set('fileIn', 'php://input');

// Register layer definitions.
nl_setLayerSources();

// Run the plugin.
$neatline = new NeatlinePlugin();
$neatline->setUp();
