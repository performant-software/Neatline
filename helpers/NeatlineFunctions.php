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
 * Include the static files for the Neatline.
 */
function _nl_exhibitAssets()
{
    _nl_mapApis();
    queue_css_file('payloads/neatline');
    queue_js_file('payloads/neatline');
    queue_js_file('bootstrap');
}


/**
 * Include the static files for the editor.
 */
function _nl_editorAssets()
{
    _nl_mapApis();
    queue_css_file('payloads/editor');
    queue_js_file('payloads/editor');
    queue_js_file('bootstrap');
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
        'exhibit_id'    => $exhibit->id,
        'records_api'   => public_url('neatline/records/'.$exhibit->id),
        'record_api'    => public_url('neatline/record'),
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
        'styles_api'    => url('neatline/styles/'.$exhibit->id),
        'page_length'   => (int) get_plugin_ini('Neatline', 'page_length')
    );
}


/**
 * Gather style columns exposed via the `neatline_links` filter.
 *
 * @return array The array of column names.
 */
function _nl_getStyles()
{
    return apply_filters('neatline_styles', array());
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
function _nl_getAllLayers()
{
    $file = Zend_Registry::get('layers');
    return Zend_Json::decode(file_get_contents($file));
}


/**
 * Get an array of grouped id => name layer pairs for form select.
 *
 * @return array The layers.
 */
function _nl_getLayersForSelect()
{

    $all = _nl_getAllLayers();

    $options = array();
    foreach ($all as $group => $layers) {
        $options[$group] = array();
        foreach ($layers as $layer) {
            $options[$group][$layer['id']] = $layer['title'];
        }
    }

    return $options;

}


/**
 * Get just the layers included in a comma-delimited string.
 *
 * @param string $ids A comma-delimited list of layer ids.
 * @return array The layers.
 */
function _nl_getLayers($ids)
{

    $all = _nl_getAllLayers();
    $ids = _nl_explode($ids);

    $subset = array();
    foreach ($all as $group => $layers) {
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
    $exhibit = $exhibit ? $exhibit : _nl_currentExhibit();
    return $exhibit->$fieldname;
}


/**
 * Returns the current neatline.
 *
 * @return NeatlineExhibit|null
 */
function _nl_currentExhibit()
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
    return ($view->neatline_exhibits &&
        count($view->neatline_exhibits)
    );
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
    $exhibit = $exhibit ? $exhibit : _nl_currentExhibit();
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
    $neatline = $neatline ? $neatline : _nl_currentExhibit();
    return (int)$neatline->getNumberOfRecords();
}
