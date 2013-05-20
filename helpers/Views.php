<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Set the script paths for template compilation.
 */
function nl_setView()
{

    $view = new Omeka_View();

    // Omeka and Neatline templates.
    $view->setScriptPath(VIEW_SCRIPTS_DIR);
    $view->addScriptPath(NL_DIR . '/views/shared');

    // Theme templates.
    $view->addScriptPath(PUBLIC_THEME_DIR . '/' .
        get_option('public_theme') . '/neatline'
    );

    // Register the view.
    Zend_Registry::set('view', $view);

}


/**
 * Returns a link to a Neatline exhibit.
 *
 * @param NeatlineExhibit|null $exhibit The exhibit record.
 * @param string $action The action for the link.
 * @param string $text The link text.
 * @param array $props Array of properties for the element.
 * @return string The HTML link.
 */
function nl_link($exhibit, $action, $text, $props=array(), $public=true) {

    // Get exhibit and link text.
    $exhibit = $exhibit ? $exhibit : nl_exhibit();
    $text = $text ? $text : nl_field('title');

    // Get the exhibit identifier.
    if ($action == 'show') $identifier = $exhibit->slug;
    else $identifier = $exhibit->id;

    // Construct the exhibit route.
    $route = 'neatline/' . $action . '/' . $identifier;
    $props['href'] = $public ? public_url($route) : url($route);

    // Return the anchor tag.
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
 * Returns the current neatline.
 *
 * @return NeatlineExhibit|null
 */
function nl_exhibit()
{
    return get_view()->neatline_exhibit;
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
