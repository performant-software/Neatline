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
function _nl_formAssets()
{
    queue_css_file('payloads/form');
    queue_js_file('payloads/form');
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
 * Construct exhibit globals.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 * @return string JSON exhibit defaults.
 */
function _nl_exhibitGlobals($exhibit)
{
    return json_encode(array(
        'id'  => $exhibit->id,
        'api' => array(
            'records' => public_url('neatline/records/'.$exhibit->id),
            'record'  => public_url('neatline/record')
        ),
        'map' => array(
            'focus' => $exhibit->map_focus,
            'zoom'  => $exhibit->map_zoom
        )
    ));
}


/**
 * Construct editor globals.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 * @return string JSON exhibit defaults.
 */
function _nl_editorGlobals($exhibit)
{
    return json_encode(array(
        'api' => array(
            'styles' => url('neatline/styles/'.$exhibit->id),
        ),
        'perPage' => (int) get_plugin_ini('Neatline', 'records_per_page')
    ));
}


/**
 * Gather style columns exposed via the `_nl_links` filter.
 *
 * @return array The array of label => column name.
 */
function _nl_getStyles()
{
  return apply_filters('neatline_styles', array());
}


/**
 * Gather the column names for all taggable styles.
 *
 * @return array The array of column names.
 */
function _nl_getStyleCols()
{
  return array_values(_nl_getStyles());
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
 * @param string $file The layers file.
 * @return array The layers.
 */
function _nl_getAllLayers($file=null)
{
    $file = $file ? $file : NL_DIR . '/layers.json';
    return Zend_Json::decode(file_get_contents($file));
}


/**
 * Get an array of grouped id => name layer pairs for form select.
 *
 * @param string $file The layers file.
 * @return array The layers.
 */
function _nl_getLayersForSelect($file=null)
{

    $all = _nl_getAllLayers($file);

    $options = array();
    foreach ($all as $group => $layers) {
        $options[$group] = array();
        foreach ($layers as $layer) {
            $options[$group][$layer['id']] = $layer['name'];
        }
    }

    return $options;

}


/**
 * Get just the layers included in a comma-delimited string.
 *
 * @param string $ids A comma-delimited list of layer ids.
 * @param string $file The layers file.
 * @return array The layers.
 */
function _nl_getLayers($ids, $file=null)
{

    $all = _nl_getAllLayers($file);
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
function _nl_totalRecords($neatline = null)
{
    $neatline = $neatline ? $neatline : _nl_currentExhibit();
    return (int)$neatline->getNumberOfRecords();
}
