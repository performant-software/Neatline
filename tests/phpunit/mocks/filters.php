<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Register mock widgets.
 *
 * @param array $widgets Widgets, NAME => ID.
 * @return array The array, with mock widgets.
 */
function nl_mockWidgets($widgets)
{
    return array_merge($widgets, array(
        'Widget1 Label' => 'Widget1',
        'Widget2 Label' => 'Widget2',
        'Widget3 Label' => 'Widget3'
    ));
}


/**
 * Register mock presenters.
 *
 * @param array $presenters Presenters, NAME => ID.
 * @return array The array, with mock presenters.
 */
function nl_mockPresenters($presenters)
{
    return array_merge($presenters, array(
        'Presenter1 Label' => 'Presenter1',
        'Presenter2 Label' => 'Presenter2',
        'Presenter3 Label' => 'Presenter3'
    ));
}
