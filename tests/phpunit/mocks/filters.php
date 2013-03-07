<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Mock filter callbacks.
 *
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
function _nl_mockWidgets($widgets)
{
    return array_merge($widgets, array(
        'Widget1 Label' => array(
            'id'    => 'Widget1',
            'slug'  => 'widget-1',
            'pane'  => 'form1'
        ),
        'Widget2 Label' => array(
            'id'    => 'Widget2',
            'slug'  => 'widget-2',
            'pane'  => 'form2'
        ),
        'Widget3 Label' => array(
            'id'    => 'Widget3',
            'slug'  => 'widget-3',
            'pane'  => 'form3'
        )
    ));
}
