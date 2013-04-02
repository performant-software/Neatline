<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Plugin helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Gather exhibit widgets via the `neatline_exhibit_widgets` filter.
 *
 * @return array An array of widget name => ids.
 */
function _nl_getExhibitWidgets()
{
    return apply_filters('neatline_exhibit_widgets', array());
}


/**
 * Gather presenters via the `neatline_presenters` filter.
 *
 * @return array An array of presenter name => ids.
 */
function _nl_getPresenters()
{
    return apply_filters('neatline_presenters', array());
}


/**
 * Gather style columns via the `neatline_styles` filter.
 *
 * @return array An array of column names.
 */
function _nl_getStyles()
{
    return apply_filters('neatline_styles', array());
}


/**
 * Gather record tabs via the `neatline_record_tabs` filter.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 * @return array An array of widget name => ids.
 */
function _nl_getRecordTabs($exhibit)
{
    return apply_filters('neatline_record_tabs', array(), array(
        'exhibit' => $exhibit
    ));
}


/**
 * Gather exhibit tabs via the `neatline_exhibit_tabs` filter.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 * @return array An array of widget name => ids.
 */
function _nl_getExhibitTabs($exhibit)
{
    return apply_filters('neatline_exhibit_tabs', array(), array(
        'exhibit' => $exhibit
    ));
}


/**
 * Gather global properties exposed via the `neatline_globals` filter.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 * @return array The array of key => values.
 */
function _nl_getGlobals($exhibit)
{
    return apply_filters('neatline_globals', array(), array(
        'exhibit' => $exhibit
    ));
}
