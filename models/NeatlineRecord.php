<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Row class for Neatline data record.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecord extends Omeka_Record_AbstractRecord
{


    /**
     * The id of the parent item.
     * int(10) unsigned NULL
     */
    public $item_id;

    /**
     * The id of the parent exhibit.
     * int(10) unsigned NULL
     */
    public $exhibit_id;

    /**
     * Record default tag.
     * int(10) unsigned NULL
     */
    public $tag_id;

    /**
     * A plaintext, unique identifier.
     * varchar(100) NULL
     */
    public $slug;

    /**
     * The title for the record.
     * mediumtext COLLATE utf8_unicode_ci NULL
     */
    public $title;

    /**
     * A plaintext description for the record.
     * mediumtext COLLATE utf8_unicode_ci NULL
     */
    public $body;

    /**
     * A comma-delimited list of tags.
     * text COLLATE utf8_unicode_ci NULL
     */
    public $tags;

    /**
     * KML for geometries.
     * mediumtext COLLATE utf8_unicode_ci NULL
     */
    public $coverage;

    /**
     * True if the record is present on the map.
     * tinyint(1) NULL
     */
    public $map_active;

    /**
     * Default map focus position
     * varchar(100) NULL
     */
    public $map_focus;

    /**
     * Default map zoom level.
     * int(10) unsigned NULL
     */
    public $map_zoom;

    /**
     * *** Tag reference.
     * int(10) unsigned NOT NULL
     */
    public $vector_color;

    /**
     * *** Tag reference.
     * int(10) unsigned NOT NULL
     */
    public $stroke_color;

    /**
     * *** Tag reference.
     * int(10) unsigned NOT NULL
     */
    public $select_color;

    /**
     * *** Tag reference.
     * int(10) unsigned NOT NULL
     */
    public $vector_opacity;

    /**
     * *** Tag reference.
     * int(10) unsigned NOT NULL
     */
    public $select_opacity;

    /**
     * *** Tag reference.
     * int(10) unsigned NOT NULL
     */
    public $stroke_opacity;

    /**
     * *** Tag reference.
     * int(10) unsigned NOT NULL
     */
    public $image_opacity;

    /**
     * *** Tag reference.
     * int(10) unsigned NOT NULL
     */
    public $stroke_width;

    /**
     * *** Tag reference.
     * int(10) unsigned NOT NULL
     */
    public $point_radius;

    /**
     * *** Tag reference.
     * int(10) unsigned NOT NULL
     */
    public $point_image;

    /**
     * *** Tag reference.
     * int(10) unsigned NOT NULL
     */
    public $max_zoom;

    /**
     * *** Tag reference.
     * int(10) unsigned NOT NULL
     */
    public $min_zoom;


    /**
     * Locally-stored fields.
     */
    protected static $local = array(
        'slug',
        'title',
        'body',
        'tags',
        'map_active',
        'map_focus',
        'map_zoom'
    );


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
    public function __construct($item = null, $exhibit = null)
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
     * Update the `coverage` field with the `GeomFromText` function.
     *
     * @param string $wkt The coverage as a WKT string.
     */
    public function setCoverage($wkt)
    {

        $sql = "
            UPDATE `{$this->_db->prefix}neatline_records`
            SET coverage = GeomFromText('{$wkt}')
            WHERE id = {$this->id}
        ";

        $this->_db->query($sql);

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
     * Get or create the record-specific tag.
     *
     * @return Omeka_record The record tag.
     */
    public function getTag()
    {

        if (!is_null($this->tag_id)) {

            // Try to get existing tag.
            $tagsTable = $this->getTable('NeatlineTag');
            $tag = $tagsTable->find($this->tag_id);

        }

        else {

            // Create new tag.
            $exhibit = $this->getExhibit();
            $tag = new NeatlineTag($exhibit);
            $tag->save();

            // Set reference.
            $this->tag_id = $tag->id;
            $this->save();

        }

        return $tag;

    }


    /**
     * Update the record.
     *
     * @param array $values The PUT values.
     */
    public function update($values)
    {

        // Update fields.
        $this->setFields($values);
        $this->setStyles($values);
        $this->setTags();

        // Get coverage.
        $coverage = array_key_exists('coverage', $values) ?
            $values['coverage'] : null;

        // Save.
        $this->save($coverage);

    }


    /**
     * Update locally-stored, non-style fields.
     *
     * @param array $values An associative array of values.
     */
    public function setFields($values)
    {

        // Walk non-style keys.
        foreach (self::$local as $field) {

            // If the key is passed, set it.
            if (array_key_exists($field, $values)) {
                $this->setNotEmpty($field, $values[$field]);
            }

        }

    }


    /**
     * Create, modify, or delete the record-specific style tag that stores
     * style values set directly on the record.
     *
     * @param array $values An associative array of values.
     */
    public function setStyles($values)
    {

        // ----------------------------------------------------------------
        // Check to see if any of the passed values are valid, non-null
        // styles. This is the case when values are entered directly into
        // the "Style" tab in a record edit form.
        // ----------------------------------------------------------------

        $localStyles = false;

        // Walk style keys.
        foreach (self::$styles as $s) {

            // Check for first defined, non-null style.
            if (array_key_exists($s, $values) && !is_null($values[$s])) {
                $localStyles = true; break;
            }

        }

        // ----------------------------------------------------------------
        // If so, then these values need to be stored in a record-specific
        // "local" tag referenced by the record's `tag_id` attribute. This
        // tag is not created by default for the record (since it is not
        // needed when all of a record's styles are inherited from regular
        // tags) and needs to created if it does not already exist.
        // ----------------------------------------------------------------

        if ($localStyles) {

            // Get the local tag.
            $tag = $this->getTag();

            // Update the tag fields.
            foreach (self::$styles as $style) {
                if (array_key_exists($style, $values)) {
                    $tag[$style] = $values[$style];
                }
            }

            $tag->save();

        }

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

            // Relations:
            'id'                => $this->id,
            'item_id'           => $this->item_id,

            // Text:
            'title'             => $this->title,
            'body'              => $this->body,
            'slug'              => $this->slug,

            // Styles:
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

            // Spatial:
            'map_focus'         => $this->map_focus,
            'map_zoom'          => $this->map_zoom,
            'coverage'          => $coverage,
            'wmsAddress'        => null,
            'layers'            => null,

            // Statuses:
            'map_active'        => $this->map_active

        );

        return $data;

    }


    /**
     * Before saving, point any NULL style tag references to the default
     * tag for the exhibit.
     */
    public function beforeSave()
    {

        // Get the exhibit default tag.
        $tagsTable = $this->getTable('NeatlineTag');
        $tag = $tagsTable->getExhibitTag($this->getExhibit());

        // Set default styles.
        foreach (self::$styles as $style) {
            if (is_null($this[$style])) $this[$style] = $tag->id;
        }

    }


    /**
     * If a WKT string is passed to save(), update the `coverage` field.
     *
     * @param string $coverage The coverage, as a WKT string.
     */
    public function save($coverage = null)
    {
        parent::save();
        if (!is_null($coverage)) $this->setCoverage($coverage);
    }


    /**
     * After saving, update the `modified` column on the parent exhibit by
     * re-saving it.
     */
    public function afterSave()
    {
        if (!is_null($this->exhibit_id)) $this->getExhibit()->save();
    }


}
