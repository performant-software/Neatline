<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Row class for Neatline base layer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineTag extends Omeka_Record_AbstractRecord
{

    /**
     * The id of the parent exhibit.
     * int(10) unsigned NULL
     */
    public $exhibit_id;

    /**
     * The id of the parent exhibit.
     * tinyint(1) NULL
     */
    public $is_default;

    /**
     * The tag name.
     * tinytext COLLATE utf8_unicode_ci NULL
     */
    public $tag;

    /**
     * The fill color for geometries.
     * tinytext COLLATE utf8_unicode_ci NULL
     */
    public $vector_color;

    /**
     * The line color for geometries.
     * tinytext COLLATE utf8_unicode_ci NULLL
     */
    public $stroke_color;

    /**
     * The highlight color for geometries.
     * tinytext COLLATE utf8_unicode_ci NULL
     */
    public $highlight_color;

    /**
     * The fill opacity for geometries.
     * int(10) unsigned NULL
     */
    public $vector_opacity;

    /**
     * The selected opacity for geometries.
     * int(10) unsigned NULL
     */
    public $select_opacity;

    /**
     * The line opacity for geometries.
     * int(10) unsigned NULL
     */
    public $stroke_opacity;

    /**
     * The opacity of points rendered as images.
     * int(10) unsigned NULL
     */
    public $graphic_opacity;

    /**
     * The width of lines on geometries.
     * int(10) unsigned NULL
     */
    public $stroke_width;

    /**
     * The radius of points on geometries.
     * int(10) unsigned NULL
     */
    public $point_radius;

    /**
     * The URL for a static to represent points.
     * tinytext COLLATE utf8_unicode_ci NULL
     */
    public $point_image;

}
