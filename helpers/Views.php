<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Set the script path depth chart for item compilation.
 */
function nl_setView()
{

    $view = new Omeka_View();

    // Omeka and Neatline templates.
    $view->addScriptPath(VIEW_SCRIPTS_DIR);
    $view->addScriptPath(NL_DIR.'/views/shared');

    // Theme templates.
    $theme = get_option('public_theme');
    $view->addScriptPath(PUBLIC_THEME_DIR.'/'.$theme.'/neatline');

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
function nl_field($fieldname, $exhibit=null)
{
    $exhibit = $exhibit ? $exhibit : nl_exhibit();
    return $exhibit->$fieldname;
}


/**
 * Returns the current neatline.
 *
 * @return NeatlineExhibit|null
 */
function nl_exhibit()
{
    return get_view()->neatline_exhibit;
}


/**
 * Are there any exhibits bound on the view.
 *
 * @return boolean
 */
function nl_areExhibits()
{
    $view = get_view();
    return $view->neatline_exhibits && count($view->neatline_exhibits);
}


/**
 * Returns a link to a Neatline exhibit.
 *
 * @param NeatlineExhibit|null $exhibit The exhibit record.
 * @param string $action The action for the link. Default is 'show'.
 * @param string $text HTML for the text of the link.
 * @param array $props Array of properties for the element.
 * @return string The HTML link.
 */
function nl_link($exhibit,$action,$text,$props=array(),$public=true) {

    $exhibit = $exhibit ? $exhibit : nl_exhibit();

    // Get the text and slug.
    $text = $text ? $text : nl_field('title', $exhibit);
    if ($action == 'show') { $slug = $exhibit->slug; }
    else { $slug = $exhibit->id; }

    // Form the route.
    $route = 'neatline/' . $action . '/' . $slug;
    $uri = $public ? public_url($route) : url($route);
    $props['href'] = $uri;

    return '<a ' . tag_attributes($props) . '>' . $text . '</a>';

}


/**
 * Count the records in an exhibit.
 *
 * @param NeatlineExhibit $exhibit The exhibit record.
 * @return integer The number of records.
 */
function nl_totalRecords($exhibit=null)
{
    $exhibit = $exhibit ? $exhibit : nl_exhibit();
    return (int) $exhibit->getNumberOfRecords();
}
