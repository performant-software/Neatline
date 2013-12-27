<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Register the template paths necessary for the item compilations.
 */
function nl_mountView()
{

    // Get or create a view.
    $view = Zend_Registry::isRegistered('view') ?
            Zend_Registry::get('view') :
            new Omeka_View();

    // Register templates:
    $view->addScriptPath(VIEW_SCRIPTS_DIR);         // Omeka
    $view->addScriptPath(NL_DIR.'/views/shared');   // Neatline
    $view->addScriptPath(nl_getPublicThemeDir());   // Theme

    // (Re)set the view:
    Zend_Registry::set('view', $view);

    return $view;

}
