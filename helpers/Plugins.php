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
 * Gather widgets via the `neatline_widgets` filter.
 *
 * @return array An array of widget name => ids.
 */
function _nl_getWidgets()
{
    return apply_filters('neatline_widgets', array());
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
 * Gather style columns via the `neatline_links` filter.
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
 * @return array An array of widget name => ids.
 */
function _nl_getRecordTabs()
{
    return apply_filters('neatline_record_tabs', array());
}


/**
 * Gather exhibit tabs via the `neatline_exhibit_tabs` filter.
 *
 * @return array An array of widget name => ids.
 */
function _nl_getExhibitTabs()
{
    return apply_filters('neatline_exhibit_tabs', array());
}


/**
 * Gather global properties exposed via the `neatline_globals` filter.
 *
 * @param NeatlineExhibit The exhibit.
 * @return array The array of key => values.
 */
function _nl_getGlobals($exhibit)
{
    return apply_filters('neatline_globals', array(), array(
        'exhibit' => $exhibit
    ));
}


/**
 * Get an array of grouped <SLUG> => <TITLE> widget pairs for form select.
 *
 * @return array The select options.
 */
function _nl_getWidgetsForSelect()
{

    $widgets = _nl_getWidgets();
    $options = array();

    // Add option for each widget.
    foreach ($widgets as $label => $widget) {
        $options[$widget['id']] = $label;
    }

    return $options;

}
