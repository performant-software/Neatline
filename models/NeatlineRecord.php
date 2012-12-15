<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Row class for NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecord extends Omeka_Record_AbstractRecord
{


    public $item_id;            // INT(10) UNSIGNED NULL
    public $exhibit_id;         // INT(10) UNSIGNED NULL
    public $tag_id;             // INT(10) UNSIGNED NULL

    public $slug;               // VARCHAR(100) NULL
    public $title;              // MEDIUMTEXT COLLATE utf8_unicode_ci NULL
    public $body;               // MEDIUMTEXT COLLATE utf8_unicode_ci NULL
    public $tags;               // TEXT COLLATE utf8_unicode_ci NULL
    public $coverage;           // GEOMETRY
    public $map_active;         // TINYINT(1) NULL
    public $map_focus;          // VARCHAR(100) NULL
    public $map_zoom;           // INT(10) UNSIGNED NULL

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

    public $_vector_color;      // INT(10) UNSIGNED NULL
    public $_stroke_color;      // INT(10) UNSIGNED NULL
    public $_select_color;      // INT(10) UNSIGNED NULL
    public $_vector_opacity;    // INT(10) UNSIGNED NULL
    public $_select_opacity;    // INT(10) UNSIGNED NULL
    public $_stroke_opacity;    // INT(10) UNSIGNED NULL
    public $_image_opacity;     // INT(10) UNSIGNED NULL
    public $_stroke_width;      // INT(10) UNSIGNED NULL
    public $_point_radius;      // INT(10) UNSIGNED NULL
    public $_point_image;       // INT(10) UNSIGNED NULL
    public $_max_zoom;          // INT(10) UNSIGNED NULL
    public $_min_zoom;          // INT(10) UNSIGNED NULL


    /**
     * Tag-reference fields.
     */
    protected static $styles = array(
        'vector_color',
        'stroke_color',
        'select_color',
        'vector_opacity',
        'select_opacity',
        'stroke_opacity',
        'image_opacity',
        'stroke_width',
        'point_radius',
        'point_image',
        'max_zoom',
        'min_zoom'
    );


    /**
     * Set foreign keys.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $exhibit The exhibit record.
     */
    public function __construct($exhibit = null, $item = null)
    {
        parent::__construct();
        if (!is_null($exhibit)) $this->exhibit_id = $exhibit->id;
        if (!is_null($item)) $this->item_id = $item->id;
    }


    /**
     * Set the an attribute if the passed value is not null or ''.
     *
     * @param string $attribute The name of the attribute.
     * @param boolean $value The value to set.
     */
    public function setNotEmpty($attribute, $value)
    {
        if ($value == '') $this[$attribute] = null;
        else $this[$attribute] = $value;
    }


    /**
     * Get the parent exhibit record.
     *
     * @return Omeka_record The parent exhibit.
     */
    public function getExhibit()
    {
        $exhibits = $this->getTable('NeatlineExhibit');
        return $exhibits->find($this->exhibit_id);
    }


    /**
     * Update the record.
     *
     * @param array $values The PUT values.
     */
    public function update($values)
    {
        foreach ($values as $key => $val) $this->setNotEmpty($key, $val);
        $this->save();
    }


    /**
     * Update the style tag references by constructing the tag depth chart
     * (record-specific tag first, then general tags ordered by the `tags`
     * string, then the exhibit default tag), walking each of the styles,
     * and finding the first tag in the list for which there is a non-null
     * value for the style in question.
     */
    public function setTags()
    {

        // Get the tag depth chart.
        $tagsTable = $this->getTable('NeatlineTag');
        $stack = $tagsTable->getTagStack($this->tags, $this);

        // For each tag-backed field:
        foreach (self::$styles as $style) {

            // Walk through the tags:
            foreach ($stack as $tag) {

                // --------------------------------------------------------
                // Stop as soon as a non-null value is found for the field
                // in question. Point the key reference on the record at
                // the tag with the value and continue to the next field.
                // --------------------------------------------------------

                if (!is_null($tag[$style])) {
                    $this[$style] = $tag->id;
                    break;
                }

            }

        }

    }


    /**
     * Assemble record data for the front-end application.
     *
     * @param string $coverage The coverage as plaintext WKT.
     * @return array The map JSON.
     **/
    public function buildJsonData($coverage=null) {

        $data = array(

            'id'                => $this->id,
            'item_id'           => $this->item_id,

            // TEXT
            'title'             => $this->title,
            'body'              => $this->body,
            'slug'              => $this->slug,

            // STYLE
            'vector_color'      => $this->vector_color,
            'stroke_color'      => $this->stroke_color,
            'select_color'      => $this->select_color,
            'vector_opacity'    => $this->vector_opacity,
            'select_opacity'    => $this->select_opacity,
            'stroke_opacity'    => $this->stroke_opacity,
            'image_opacity'     => $this->image_opacity,
            'stroke_width'      => $this->stroke_width,
            'point_radius'      => $this->point_radius,
            'point_image'       => $this->point_image,
            'min_zoom'          => $this->min_zoom,
            'max_zoom'          => $this->max_zoom,

            // SPATIAL
            'map_active'        => $this->map_active,
            'map_focus'         => $this->map_focus,
            'map_zoom'          => $this->map_zoom,
            'coverage'          => $coverage

        );

        return $data;

    }


}
