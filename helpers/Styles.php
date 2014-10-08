<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Explode a comma-delimited string. Trim and strip whitespace.
 *
 * @param string $list A comma-delimited list.
 * @return array The array of strings.
 */
function nl_explode($list)
{
    return explode(',', trim(str_replace(' ', '', $list)));
}


/**
 * Map a CSS string to an associative array.
 *
 * @param string $css CSS string.
 * @return array $styles An array of rules.
 */
function nl_readCSS($css)
{

    $styles = array();

    // Match rule sets.
    $re = '/[^{]+\s*\{\s*[^}]+\s*}/';
    preg_match_all($re, $css, $matches);
    foreach ($matches[0] as $set) {

        // Match selector.
        $re = '/\.(?P<selector>[a-z0-9_]+)\s*\{/';
        preg_match($re, $set, $matches);
        $selector = $matches['selector'];
        $styles[$selector] = array();

        // Match rules.
        $re = '/[a-z0-9-]+:\s*[^;]+;/';
        preg_match_all($re, $set, $matches);
        foreach ($matches[0] as $rule) {

            // Match property.
            $re = '/(?P<property>[a-z0-9-]+)\s*:/';
            preg_match($re, $rule, $matches);
            $prop = str_replace('-', '_', $matches['property']);

            // Match value.
            $re = '/:\s*(?P<value>[^;]+)\s*;/';
            preg_match($re, $rule, $matches);
            $val = $matches['value'];

            // Add to array.
            $styles[$selector][$prop] = $val;

        }

    }

    return $styles;

}


/**
 * Dump an associative array to a CSS string.
 *
 * @param array $styles An array of rules.
 * @param integer $breaks Number of empty lines between rule sets.
 * @param integer $indent Number of spaces to indent rules.
 * @return string $css CSS string.
 */
function nl_writeCSS($styles, $breaks=1, $indent=2)
{

    $css = "";
    $len = count($styles);
    $itr = 0;

    foreach ($styles as $selector => $rules) {

        // selector {
        $css .= ".".$selector." {\n";

        // property: value;
        foreach ($rules as $prop => $val) {
            $prop = str_replace("_", "-", $prop);
            $css .= str_repeat(" " , $indent).$prop.": ".$val.";\n";
        }

        $css .= "}";

        // If not last selector, add line break(s).
        if ($itr != $len-1) $css .= str_repeat("\n", $breaks+1);
        $itr++;

    }

    return $css;

}


/**
 * Get array of shared style columns.
 *
 * @return array An array of column names.
 */
function nl_getStyles()
{
    return array(

        // GROUPS
        'widgets',
        'presenter',

        // COLORS
        'fill_color',
        'fill_color_select',
        'stroke_color',
        'stroke_color_select',

        // OPACITIES
        'fill_opacity',
        'fill_opacity_select',
        'stroke_opacity',
        'stroke_opacity_select',

        // DIMENSIONS
        'stroke_width',
        'point_radius',
        'zindex',
        'weight',

        // DATES
        'start_date',
        'end_date',
        'after_date',
        'before_date',

        // IMAGERY
        'point_image',
        'wms_address',
        'wms_layers',

        // VISIBILITY
        'min_zoom',
        'max_zoom',
        'map_focus',
        'map_zoom'

    );
}
