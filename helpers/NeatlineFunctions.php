<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Miscellaneous helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Include the static files for the Neatline.
 *
 * @param Omeka_record $exhibit The exhibit.
 *
 * @return void.
 */
function neatline_queueNeatlineAssets()
{
    neatline_queueGoogleMapsApi();
    queue_css_file('payloads/neatline');
    queue_js_file('payloads/neatline', 'javascripts');
}

/**
 * Include the static files for the editor.
 *
 * @return void.
 */
function neatline_queueEditorAssets()
{
    queue_css_file('payloads/editor');
    queue_js_file('payloads/editor', 'javascripts');
}

/**
 * Try to find a CSS file that matches the exhibit slug.
 *
 * @return void.
 */
function neatline_queueExhibitCss($exhibit)
{
    try { queue_css_file($exhibit->slug); } catch (Exception $e) {}
}

/**
 * Include the Google Maps API.
 *
 * @return void.
 */
function neatline_queueGoogleMapsApi()
{
    $url = 'http://maps.google.com/maps/api/js?v=3.8&sensor=false';
    $headScript = get_view()->headScript();
    $headScript->appendScript('', 'text/javascript', array('src' => $url));
}

/**
 * Construct exhibit globals.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 *
 * @return array The exhibit data.
 */
function neatline_renderExhibit($exhibit)
{
    return json_encode(array(
        'id'        => $exhibit->id,
        'api'       => public_url('neatline/records'),
        'mapFocus'  => $exhibit->map_focus,
        'mapZoom'   => $exhibit->map_zoom
    ));
}

/**
 * Construct editor globals.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 *
 * @return array The exhibit data.
 */
function neatline_renderEditor($exhibit)
{
    return json_encode(array('id' => $exhibit->id));
}

/**
 * Return specific field for a neatline record.
 *
 * @param string
 * @param array $options
 * @param neatlines|null
 * @return string
 */
function neatline($fieldname, $options = array(), $neatline = null)
{

    $neatline = $neatline ? $neatline : get_current_neatline();
    $fieldname = strtolower($fieldname);
    $text = $neatline->$fieldname;

    if(isset($options['snippet']))
        $text = nls2p(snippet($text, 0, (int)$options['snippet']));

    return $text;

}

/**
 * Returns the current neatline.
 *
 * @return NeatlineExhibit|null
 */
function get_current_neatline()
{
    return get_view()->neatline_exhibit;
}

/**
 * Determines whether there are any neatlines to loop on the view.
 *
 * @return boolean
 */
function has_neatlines_for_loop()
{
    $view = get_view();
    return ($view->neatline_exhibits and count($view->neatline_exhibits));
}

/**
 * Returns the total number of neatlines in the database.
 *
 * @return integer
 */
function total_neatlines()
{
    return get_db()->getTable('NeatlineExhibits')->count();
}

/**
 * Returns a link to a Neatline exhibit.
 *
 * @param string HTML for the text of the link.
 * @param array Attributes for the link tag. (optional)
 * @param string The action for the link. Default is 'show'.
 * @param NeatlineExhibit|null
 * @return string The HTML link.
 */
function link_to_neatline(
    $text = null,
    $props = array(),
    $action = 'show',
    $neatline = null,
    $public = true)
{

    $neatline = $neatline ? $neatline : get_current_neatline();
    $text = $text ? $text : strip_formatting(neatline('title', $neatline));

    if ($action == 'show') { $slug = $neatline->slug; }
    else { $slug = $neatline->id; }

    $route = 'neatline/' . $action . '/' . $slug;
    $uri = $public ? public_url($route) : url($route);
    $props['href'] = $uri;
    return '<a ' . tag_attributes($props) . '>' . $text . '</a>';

}

/**
 * Returns the number of records used in a given Neatline.
 *
 * @param NeatlineExhibit|null
 * @return integer
 */
function total_records_for_neatline($neatline = null)
{
    $neatline = $neatline ? $neatline : get_current_neatline();
    return (int)$neatline->getNumberOfRecords();
}



// TODO|DEV: Development helpers.
// ------------------------------

/**
 * Install development exhibit.
 * @return void.
 */
function __devInstall()
{

    // Create exhibit.
    $exhibit = new NeatlineExhibit();
    $exhibit->title = 'dev';
    $exhibit->slug = 'dev';
    $exhibit->map_zoom = 10;
    $exhibit->save();

    // Create records.
    for ($i=0; $i<100; $i++) {

        // Random coordianates.
        $lat = rand(-20000000,20000000);
        $lon = rand(-20000000,20000000);

        // Create the record.
        $record = new NeatlineRecord(null, $exhibit);
        $record->title = 'Record'.$i;
        $record->description = 'Record'.$i.' body.';
        $record->map_active = 1;

        // Styles.
        $record->vector_color =     '#ff0000';
        $record->stroke_color =     '#000000';
        $record->select_color =     '#0000ff';
        $record->point_radius =     rand(10,100);
        $record->stroke_opacity =   100;
        $record->graphic_opacity =  100;
        $record->vector_opacity =   30;
        $record->select_opacity =   70;
        $record->stroke_width =     2;

        // Coverage.
        $record->save('POINT('.$lon.' '.$lat.')');

    }

}

/**
 * Uninstall development exhibit.
 * @return void.
 */
function __devUninstall()
{
    $db = get_db();
    $exhibitsTable = $db->getTable('NeatlineExhibit');
    $exhibits = $exhibitsTable->findAll();
    foreach ($exhibits as $exhibit) $exhibit->delete();
}
