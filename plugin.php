<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


if (!defined('NL_DIR')) define('NL_DIR', dirname(__FILE__));

// PLUGIN
require_once NL_DIR.'/NeatlinePlugin.php';

// MODELS
require_once NL_DIR.'/models/abstract/Neatline_Row_Abstract.php';
require_once NL_DIR.'/models/abstract/Neatline_Row_Expandable.php';
require_once NL_DIR.'/models/abstract/Neatline_Row_Expansion.php';
require_once NL_DIR.'/models/abstract/Neatline_Table_Expandable.php';
require_once NL_DIR.'/models/abstract/Neatline_Table_Expansion.php';

// JOBS
require_once NL_DIR.'/jobs/abstract/Neatline_Job_MockView.php';
require_once NL_DIR.'/jobs/Neatline_Job_ImportItems.php';
require_once NL_DIR.'/jobs/Neatline_Job_UpgradeFrom1x.php';

// MISCELLANEOUS
require_once NL_DIR.'/controllers/abstract/Neatline_Controller_Rest.php';
require_once NL_DIR.'/assertions/Neatline_Acl_Assert_RecordOwnership.php';
require_once NL_DIR.'/forms/Neatline_Form_Exhibit.php';

// MIGRATIONS
require_once NL_DIR.'/migrations/abstract/Neatline_Migration_Abstract.php';
require_once NL_DIR.'/migrations/2.0-alpha2/Neatline_Migration_20alpha2.php';
require_once NL_DIR.'/migrations/2.0-rc1/Neatline_Migration_20rc1.php';
require_once NL_DIR.'/migrations/2.0-rc3/Neatline_Migration_20rc3.php';
require_once NL_DIR.'/migrations/2.0-rc4/Neatline_Migration_20rc4.php';
require_once NL_DIR.'/migrations/2.0.0/Neatline_Migration_200.php';
require_once NL_DIR.'/migrations/2.0.2/Neatline_Migration_202.php';
require_once NL_DIR.'/migrations/2.0.2/Neatline_Migration_212.php';

// HELPERS
require_once NL_DIR.'/helpers/Acl.php';
require_once NL_DIR.'/helpers/Assets.php';
require_once NL_DIR.'/helpers/Features.php';
require_once NL_DIR.'/helpers/Globals.php';
require_once NL_DIR.'/helpers/Jobs.php';
require_once NL_DIR.'/helpers/Layers.php';
require_once NL_DIR.'/helpers/Plugins.php';
require_once NL_DIR.'/helpers/Styles.php';
require_once NL_DIR.'/helpers/Views.php';

// LIBRARIES
require_once(NL_DIR . '/lib/geoPHP/geoPHP.inc');

Zend_Registry::set('fileIn', 'php://input');
nl_setLayerSources();

$neatline = new NeatlinePlugin();
$neatline->setUp();
