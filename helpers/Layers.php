<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Layers helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Read and parse the `layers.json` file.
 *
 * @return array The layers.
 */
function nl_getLayers()
{
    $file = Zend_Registry::get('layers');
    return Zend_Json::decode(file_get_contents($file));
}


/**
 * Get an array of grouped <SLUG> => <TITLE> layer pairs for form select.
 *
 * @return array The select options.
 */
function nl_getLayersForSelect()
{

    $groups = nl_getLayers();
    $options = array();

    // Walk the layer groups.
    foreach ($groups as $group => $layers) {

        // Add an option group.
        $options[$group] = array();

        // Add option for each layer.
        foreach ($layers as $layer) {
            $options[$group][$layer['id']] = $layer['title'];
        }

    }

    return $options;

}


/**
 * Get an cropped array of layer definitions for an exhibit.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 * @return array The layers.
 */
function nl_getLayersForExhibit($exhibit)
{

    $groups = nl_getLayers();
    $subset = array();

    // Explode the list of ids in `base_layers` and merge the `base_layer`
    // id into the array, which ensures that at least 1 layer is included
    // in the case that `base_layers` is empty.
    $ids = nl_explode($exhibit->base_layers);
    $ids = array_merge($ids, array($exhibit->base_layer));

    // Walk the layer groups.
    foreach ($groups as $group => $layers) {

        // Include the layer if it is enabled in the exhihbit.
        foreach ($layers as $layer) {
            if (in_array($layer['id'], $ids)) $subset[] = $layer;
        }

    }

    return $subset;

}
