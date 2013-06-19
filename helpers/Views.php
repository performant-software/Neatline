<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Compile the record `body` markup from the parent item.
 *
 * @param NeatlineRecord $record The record.
 * @return string The item metadata.
 */
function nl_getItemMarkup($record)
{

    // Get exhibit, explode tags.
    $exhibit = $record->getExhibit();
    $tags = nl_explode($record->tags);

    // First, try to render a `item-[tag].php` template in the exhibit-
    // specific theme for the exhibit:

    foreach ($tags as $tag) { try {
        return get_view()->partial(
            'exhibits/themes/'.$exhibit->slug.'/item-'.$tag.'.php'
        );
    } catch (Exception $e) {}}

    // Next, try to render a generic `item.php` template in the exhibit-
    // specific theme for the exhibit:

    try {
        return get_view()->partial(
            'exhibits/themes/'.$exhibit->slug.'/item.php'
        );
    } catch (Exception $e) {}


    // If no exhibit-specific templates can be found, fall back to the
    // global `item.php` template, which is included in the core plugin
    // and can also be overridden in the public theme:

    return get_view()->partial('exhibits/item.php');

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
function nl_getExhibitLink(
    $exhibit, $action, $text, $props=array(), $public=true)
{

    // Get exhibit and link text.
    $exhibit = $exhibit ? $exhibit : nl_getExhibit();
    $text = $text ? $text : nl_getExhibitField('title');

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
function nl_getExhibitRecordCount($exhibit=null)
{
    $exhibit = $exhibit ? $exhibit : nl_getExhibit();
    return (int) $exhibit->getNumberOfRecords();
}


/**
 * Have any exhibits been created?
 *
 * @return boolean
 */
function nl_exhibitsHaveBeenCreated()
{
    return count(get_view()->neatline_exhibits);
}


/**
 * Render and return the exhibit partial.
 *
 * @return string The exhibit markup.
 */
function nl_getExhibitMarkup()
{
    return get_view()->partial('exhibits/partials/exhibit.php');
}


/**
 * Render and return the exhibit narrative partial.
 *
 * @return string The narrative markup.
 */
function nl_getNarrativeMarkup()
{
    return get_view()->partial('exhibits/partials/narrative.php');
}


/**
 * Return specific field for a neatline record.
 *
 * @param string $fieldname The model attribute.
 * @param NeatlineExhibit $exhibit The exhibit.
 * @return string The field value.
 */
function nl_getExhibitField($fieldname, $exhibit=null)
{
    $exhibit = $exhibit ? $exhibit : nl_getExhibit();
    return $exhibit->$fieldname;
}


/**
 * Returns the current exhibit.
 *
 * @return NeatlineExhibit|null
 */
function nl_getExhibit()
{
    return get_view()->neatline_exhibit;
}
