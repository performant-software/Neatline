<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

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


    public $exhibit_id;         // INT(10) UNSIGNED NOT NULL
    public $tag;                // TINYTEXT COLLATE utf8_unicode_ci NULL

    public $vector_color;       // TINYTEXT COLLATE utf8_unicode_ci NULL
    public $stroke_color;       // TINYTEXT COLLATE utf8_unicode_ci NULL
    public $select_color;       // TINYTEXT COLLATE utf8_unicode_ci NULL
    public $vector_opacity;     // INT(10) UNSIGNED NULL
    public $select_opacity;     // INT(10) UNSIGNED NULL
    public $stroke_opacity;     // INT(10) UNSIGNED NULL
    public $image_opacity;      // INT(10) UNSIGNED NULL
    public $stroke_width;       // INT(10) UNSIGNED NULL
    public $point_radius;       // INT(10) UNSIGNED NULL
    public $point_image;        // TINYTEXT COLLATE utf8_unicode_ci NULL
    public $max_zoom;           // INT(10) UNSIGNED NULL
    public $min_zoom;           // INT(10) UNSIGNED NULL


    /**
     * Set foreign keys.
     *
     * @param Omeka_record $exhibit The exhibit record.
     */
    public function __construct($exhibit = null)
    {
        parent::__construct();
        if (!is_null($exhibit)) $this->exhibit_id = $exhibit->id;
    }


}
