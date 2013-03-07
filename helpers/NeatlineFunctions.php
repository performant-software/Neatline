<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Miscellaneous helpers.
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
 * Include the Google Maps API.
 */
function _nl_mapApis()
{
    $head = get_view()->headScript();
    $head->appendScript('', 'text/javascript', array('src' =>
        'http://maps.google.com/maps/api/js?sensor=false')
    );
}


/**
 * Include static files for the exhibit form.
 */
function _nl_formAssets()
{
    queue_css_file('payloads/form');
    queue_js_file('payloads/form');
}


/**
 * Include static files for the exhibit.
 *
 * @param NeatlineExhibit The exhibit.
 */
function _nl_exhibitAssets($exhibit)
{
    _nl_mapApis();
    _nl_exhibitCss($exhibit);
    queue_css_file('payloads/neatline');
    fire_plugin_hook('neatline_public_css');
    queue_js_file('payloads/neatline');
    fire_plugin_hook('neatline_public_js');
    queue_js_file('bootstrap');
}


/**
 * Include static files for the editor.
 */
function _nl_editorAssets()
{
    _nl_mapApis();
    queue_css_file('payloads/editor');
    fire_plugin_hook('neatline_editor_css');
    queue_js_file('payloads/editor');
    fire_plugin_hook('neatline_editor_js');
    queue_js_file('bootstrap');
}


/**
 * Try to load an exhibit-specific css file.
 *
 * @param NeatlineExhibit The exhibit.
 */
function _nl_exhibitCss($exhibit)
{
    try {
        queue_css_file($exhibit->slug);
    } catch (Exception $e) {}
}


/**
 * Construct exhibit globals array.
 *
 * @param NeatlineExhibit The exhibit.
 * @return array The array of globals.
 */
function _nl_exhibitGlobals($exhibit)
{
    return array(
        'exhibit'       => $exhibit->toArray(),
        'records_api'   => public_url('neatline/records/'.$exhibit->id),
        'record_api'    => public_url('neatline/record'),
        'base_layers'   => _nl_getLayersForExhibit($exhibit),
        'base_layer'    => $exhibit->base_layer,
        'map_zoom'      => $exhibit->map_zoom,
        'map_focus'     => $exhibit->map_focus
    );
}


/**
 * Construct editor globals array.
 *
 * @param NeatlineExhibit The exhibit.
 * @return array The array of globals.
 */
function _nl_editorGlobals($exhibit)
{
    return array(
        'exhibit_put'   => url('neatline/put/'.$exhibit->id),
        'styles_api'    => url('neatline/styles/'.$exhibit->id),
        'page_length'   => (int) get_plugin_ini('Neatline', 'page_length')
    );
}


/**
 * Explode a comma-delimited string. Trim and strip whitespace.
 *
 * @param string $list A comma-delimited list.
 * @return array The array of strings.
 */
function _nl_explode($list)
{
    return explode(',', trim(str_replace(' ', '', $list)));
}


/**
 * Read and parse the `layers.json` file.
 *
 * @return array The layers.
 */
function _nl_getLayers()
{
    $file = Zend_Registry::get('layers');
    return Zend_Json::decode(file_get_contents($file));
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


/**
 * Get an array of grouped <SLUG> => <TITLE> layer pairs for form select.
 *
 * @return array The select options.
 */
function _nl_getLayersForSelect()
{

    $groups = _nl_getLayers();
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
function _nl_getLayersForExhibit($exhibit)
{

    $groups = _nl_getLayers();
    $subset = array();

    // Explode the list of ids in `base_layers` and merge the `base_layer`
    // id into the array, which ensures that at least 1 layer is included
    // in the case that `base_layers` is empty.
    $ids = _nl_explode($exhibit->base_layers);
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


/**
 * Return specific field for a neatline record.
 *
 * @param string $fieldname The model attribute.
 * @param NeatlineExhibit $exhibit The exhibit.
 * @return string The field value.
 */
function _nl_field($fieldname, $exhibit=null)
{
    $exhibit = $exhibit ? $exhibit : _nl_exhibit();
    return $exhibit->$fieldname;
}


/**
 * Returns the current neatline.
 *
 * @return NeatlineExhibit|null
 */
function _nl_exhibit()
{
    return get_view()->neatline_exhibit;
}


/**
 * Are there any exhibits bound on the view.
 *
 * @return boolean
 */
function _nl_areExhibits()
{
    $view = get_view();
    return $view->neatline_exhibits && count($view->neatline_exhibits);
}


/**
 * Returns a link to a Neatline exhibit.
 *
 * @param NeatlineExhibit|null $exhibit The exhibit record.
 * @param string $text HTML for the text of the link.
 * @param array $props Array of properties for the element.
 * @param string $action The action for the link. Default is 'show'.
 * @return string The HTML link.
 */
function _nl_link($exhibit=null, $text=null, $props=array(),
    $action='show', $public=true) {

    // Get the text and slug.
    $exhibit = $exhibit ? $exhibit : _nl_exhibit();
    $text = $text ? $text : _nl_field('title', $exhibit);
    if ($action == 'show') { $slug = $exhibit->slug; }
    else { $slug = $exhibit->id; }

    // Form the route.
    $route = 'neatline/'.$action.'/'.$slug;
    $uri = $public ? public_url($route) : url($route);
    $props['href'] = $uri;

    return '<a '.tag_attributes($props).'>'.$text.'</a>';

}


/**
 * Returns the number of records used in a given Neatline.
 *
 * @param NeatlineExhibit $neatline The exhibit record.
 * @return integer
 */
function _nl_totalRecords($neatline=null)
{
    $neatline = $neatline ? $neatline : _nl_exhibit();
    return (int)$neatline->getNumberOfRecords();
}
