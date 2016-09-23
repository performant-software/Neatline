<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Compile item metadata for the lazy-loaded `item_body` record attribute.
 *
 * @param Item $item The parent item.
 * @param NeatlineRecord|null $record The record.
 * @return string The item metadata.
 */
function nl_getItemMarkup($item, $record=null)
{

    // Set the item on the view.
    set_current_record('item', $item);

    if (!is_null($record)) {

        // Get exhibit slug and tags.
        $slug = $record->getExhibit()->slug;
        $tags = nl_explode($record->tags);

        // First, try to render an exhibit-specific `item-[tag].php` template.

        foreach ($tags as $tag) { try {
            return get_view()->render(
                'exhibits/themes/'.$slug.'/item-'.$tag.'.php'
            );
        } catch (Exception $e) {}}

        // Next, try to render an exhibit-specific `item.php` template.

        try {
            return get_view()->render(
                'exhibits/themes/'.$slug.'/item.php'
            );
        } catch (Exception $e) {}

    }

    // Default to the global `item.php` template, which is included in the
    // core plugin and can also be overridden in the public theme:

    return get_view()->render('exhibits/item.php');

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

    // Get the exhibit identifier (`id` or `slug`).
    if (in_array($action, array('show', 'fullscreen'))) {
        $identifier = $exhibit->slug;
    } else $identifier = $exhibit->id;

    // Construct the exhibit route.
    $route = 'neatline/'.$action.'/'.$identifier;
    $props['href'] = $public ? public_url($route) : url($route);

    // Return the anchor tag.
    return '<a '.tag_attributes($props).'>'.$text.'</a>';

}

/**
 * Returns a link to a Neatline exhibit.
 *
 * @param NeatlineExhibit|null $exhibit The exhibit record.
 * @param string $action The action for the link.
 * @return string The URL.
 */
function nl_getExhibitUrl($exhibit, $action, $public=true)
{
    $exhibit = $exhibit ? $exhibit : nl_getExhibit();

    if (in_array($action, array('show', 'fullscreen'))) {
        $identifier = $exhibit->slug;
    } else {
        $identifier = $exhibit->id;
    }

    $route = 'neatline/'.$action.'/'.$identifier;
    $href  = $public ? public_url($route) : url($route);

    return $href;
}

/**
 * Returns a link to an accessible alternative to a Neatline exhibit.
 *
 * @param NeatlineExhibit|null $exhibit The exhibit record.
 */
function nl_getExhibitAccessibleURL($exhibit=null, $text)
{
    $exhibit = $exhibit ? $exhibit : nl_getExhibit();
    $accessible_url = nl_getExhibitField('accessible_url');

    if (empty($accessible_url)) { 
        return null;
    } 

    $link = '<a class="nl-hidden" id="accessible-link" href="' . $accessible_url . '">'. $text . '</a> ';
  
    return $link;
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
 * Get a list of space-delimited exhibit widget tags for use as the value
 * of a `class` attribute on an element.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 * @return string The space-delimited attribute value.
 */
function nl_getExhibitWidgetClasses($exhibit=null)
{
    $exhibit = $exhibit ? $exhibit : nl_getExhibit();
    return implode(' ', nl_explode($exhibit->widgets));
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
