<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Gather exhibit widgets via the `neatline_exhibit_widgets` filter.
 *
 * @return array An array of widget name => ids.
 */
function nl_getExhibitWidgets()
{
    return apply_filters('neatline_exhibit_widgets', array());
}


/**
 * Gather exhibit widgets via the `neatline_exhibit_widgets` filter.
 *
 * @return array An array of widget name => ids.
 */
function nl_getRecordWidgets()
{
    return apply_filters('neatline_record_widgets', array());
}


/**
 * Gather presenters via the `neatline_presenters` filter.
 *
 * @return array An array of presenter name => ids.
 */
function nl_getPresenters()
{
    return apply_filters('neatline_presenters', array());
}


/**
 * Gather exhibit expansion tables.
 *
 * @return array An array of `Neatline_Table_Expansion`.
 */
function nl_getExhibitExpansions()
{
    return apply_filters('neatline_exhibit_expansions', array());
}


/**
 * Gather record expansion tables.
 *
 * @return array An array of `Neatline_Table_Expansion`.
 */
function nl_getRecordExpansions()
{
    return apply_filters('neatline_record_expansions', array());
}


/**
 * Gather exhibit tabs via the `neatline_exhibit_tabs` filter.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 * @return array An array of widget name => ids.
 */
function nl_getExhibitTabs($exhibit)
{
    return apply_filters('neatline_exhibit_tabs', array(), array(
        'exhibit' => $exhibit
    ));
}


/**
 * Gather global properties exposed via the `neatline_globals` filter.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 * @return array The modified array of key => values.
 */
function nl_getGlobals($exhibit)
{
    return apply_filters('neatline_globals', array(), array(
        'exhibit' => $exhibit
    ));
}
