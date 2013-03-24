<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Miscellaneous helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Set a mock `Omeka_View` instance in the registry.
 */
function _nl_mockView()
{

    $view = new Omeka_View;

    // Default templates.
    $view->setScriptPath(VIEW_SCRIPTS_DIR);

    // Neatline templates.
    $view->addScriptPath(NL_DIR . '/views/shared');

    // Theme templates.
    $theme = get_option('public_theme');
    $view->addScriptPath(PUBLIC_THEME_DIR . '/' . $theme . '/neatline');

    // Register the view.
    Zend_Registry::set('view', $view);

}


/**
 * Return specific field for a neatline record.
 *
 * @param string $fieldname The model attribute.
 * @param NeatlineExhibit $exhibit The exhibit.
 * @return string The field value.
 */
function _nl_field($fieldname, $exhibit=null)
{
    $exhibit = $exhibit ? $exhibit : _nl_exhibit();
    return $exhibit->$fieldname;
}


/**
 * Returns the current neatline.
 *
 * @return NeatlineExhibit|null
 */
function _nl_exhibit()
{
    return get_view()->neatline_exhibit;
}


/**
 * Are there any exhibits bound on the view.
 *
 * @return boolean
 */
function _nl_areExhibits()
{
    $view = get_view();
    return $view->neatline_exhibits && count($view->neatline_exhibits);
}


/**
 * Returns a link to a Neatline exhibit.
 *
 * @param NeatlineExhibit|null $exhibit The exhibit record.
 * @param string $text HTML for the text of the link.
 * @param array $props Array of properties for the element.
 * @param string $action The action for the link. Default is 'show'.
 * @return string The HTML link.
 */
function _nl_link($exhibit=null, $text=null, $props=array(),
    $action='show', $public=true) {

    // Get the text and slug.
    $exhibit = $exhibit ? $exhibit : _nl_exhibit();
    $text = $text ? $text : _nl_field('title', $exhibit);
    if ($action == 'show') { $slug = $exhibit->slug; }
    else { $slug = $exhibit->id; }

    // Form the route.
    $route = 'neatline/'.$action.'/'.$slug;
    $uri = $public ? public_url($route) : url($route);
    $props['href'] = $uri;

    return '<a '.tag_attributes($props).'>'.$text.'</a>';

}


/**
 * Returns the number of records used in a given Neatline.
 *
 * @param NeatlineExhibit $neatline The exhibit record.
 * @return integer
 */
function _nl_totalRecords($neatline=null)
{
    $neatline = $neatline ? $neatline : _nl_exhibit();
    return (int)$neatline->getNumberOfRecords();
}
