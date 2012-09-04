<?php
/**
 * Plugin runner.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


// constants {{{
if (!defined('NEATLINE_PLUGIN_VERSION')) {
    define('NEATLINE_PLUGIN_VERSION', get_plugin_ini('Neatline', 'version'));
}

if (!defined('NEATLINE_PLUGIN_DIR')) {
    define('NEATLINE_PLUGIN_DIR', dirname(__FILE__));
}
// }}}


// requires {{{
require_once NEATLINE_PLUGIN_DIR . '/NeatlinePlugin.php';
require_once HELPERS;
// // }}}

$neatline = new NeatlinePlugin();
$neatline->setUp();
