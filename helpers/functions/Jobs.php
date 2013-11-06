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

    // (1) Omeka templates:
    $view->addScriptPath(VIEW_SCRIPTS_DIR);

    // (2) Neatline templates:
    $view->addScriptPath(NL_DIR.'/views/shared');

    // (3) Theme templates:
    $view->addScriptPath(nl_getPublicThemeDir());

    // (Re)set the view.
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

    if (nl_isUsingS3()) return;

    // Get the current value of `webDir`.
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

    if (nl_isUsingS3()) return;

    // Create a new adapter with the path.
    $adapter = new Omeka_Storage_Adapter_Filesystem(array(
        'webDir' => $dir
    ));

    // Set the adapter on the storage.
    Zend_Registry::get('storage')->setAdapter($adapter);

}


/**
 * Is Omeka using the S3 storage adapter?
 *
 * @return boolean
 */
function nl_isUsingS3()
{
    $adapter = Zend_Registry::get('storage')->getAdapter();
    return get_class($adapter) == 'Omeka_Storage_Adapter_ZendS3';
}
