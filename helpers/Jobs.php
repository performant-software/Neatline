<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Register the template paths necessary for the item compilations.
 */
function nl_mockView()
{

    // Get or create a view.
    $view = Zend_Registry::isRegistered('view') ?
            Zend_Registry::get('view') :
            new Omeka_View();

    // Default Omeka templates:
    // ------------------------
    $view->addScriptPath(VIEW_SCRIPTS_DIR);

    // Neatline plugin templates:
    // --------------------------
    $view->addScriptPath(NL_DIR.'/views/shared');

    // Public theme templates:
    // -----------------------
    $view->addScriptPath(nl_getPublicThemeDir());

    // Inject new view.
    Zend_Registry::set('view', $view);

    return $view;

}


/**
 * Get the `webDir` attribute on the filesystem adapter.
 *
 * @return string The current web directory.
 */
function nl_getWebDir()
{
    $options = Zend_Registry::get('storage')->getAdapter()->getOptions();
    return $options['webDir'];
}


/**
 * Inject a new filesystem adapter with a custom `webDir`.
 *
 * @param string $dir The custom path.
 */
function nl_setWebDir($dir)
{

    // Create a new adapter with the path.
    $adapter = new Omeka_Storage_Adapter_Filesystem(array(
        'webDir' => $dir
    ));

    // Set the adapter on the storage.
    Zend_Registry::get('storage')->setAdapter($adapter);

}
