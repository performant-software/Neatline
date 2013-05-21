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

    // `item-[slug]-[tag]`.
    foreach ($tags as $tag) { try {
        return get_view()->partial(
            'exhibits/item-'.$exhibit->slug.'-'.$tag.'.php'
        );
    } catch (Exception $e) {}}

    // `item-[slug]`.
    try {
        return get_view()->partial(
            'exhibits/item-'.$exhibit->slug.'.php'
        );
    } catch (Exception $e) {}

    // Fall back to default `item`.
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
 * Returns the current exhibit.
 *
 * @return NeatlineExhibit|null
 */
function nl_getExhibit()
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
function nl_getExhibitField($fieldname, $exhibit=null)
{
    $exhibit = $exhibit ? $exhibit : nl_getExhibit();
    return $exhibit->$fieldname;
}
