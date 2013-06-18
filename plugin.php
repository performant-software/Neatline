<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


if (!defined('NL_DIR')) define('NL_DIR', dirname(__FILE__));

$migrations                 = NL_DIR.'/migrations';
$models                     = NL_DIR.'/models/abstract';
$controllers                = NL_DIR.'/controllers/abstract';
$jobs                       = NL_DIR.'/jobs';
$forms                      = NL_DIR.'/forms';
$acl                        = NL_DIR.'/acl';
$helpers                    = NL_DIR.'/helpers';

require_once NL_DIR.        '/NeatlinePlugin.php';
require_once $migrations.   '/abstract/Neatline_Migration_Abstract.php';
require_once $migrations.   '/2.0-alpha2/Neatline_Migration_20alpha2.php';
require_once $migrations.   '/2.0-alpha3/Neatline_Migration_20alpha3.php';
require_once $models.       '/Neatline_Row_Abstract.php';
require_once $models.       '/Neatline_Row_Expandable.php';
require_once $models.       '/Neatline_Row_Expansion.php';
require_once $models.       '/Neatline_Table_Expandable.php';
require_once $models.       '/Neatline_Table_Expansion.php';
require_once $controllers.  '/Neatline_Controller_Rest.php';
require_once $jobs.         '/Neatline_Job_ImportItems.php';
require_once $forms.        '/Neatline_Form_Exhibit.php';
require_once $acl.          '/Neatline_Acl_Assert_RecordOwnership.php';
require_once $helpers.      '/Acl.php';
require_once $helpers.      '/Assets.php';
require_once $helpers.      '/Globals.php';
require_once $helpers.      '/Jobs.php';
require_once $helpers.      '/Layers.php';
require_once $helpers.      '/Plugins.php';
require_once $helpers.      '/Styles.php';
require_once $helpers.      '/Views.php';

Zend_Registry::set('layers', NL_DIR.'/layers');
Zend_Registry::set('fileIn', 'php://input');

$neatline = new NeatlinePlugin();
$neatline->setUp();
