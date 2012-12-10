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
     * The URL slug for the exhibit.
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
     * Record-specifici tag.
     * int(10) unsigned NULL
     */
    public $tag;

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
     * List of tag-reference keys.
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
     * Instantiate and foreign keys.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     */
    public function __construct($item = null, $neatline = null)
    {

        parent::__construct();

        // If defined, set the item key.
        if (!is_null($item)) {
            $this->item_id = $item->id;
        }

        // If defined, set the item key.
        if (!is_null($neatline)) {
            $this->exhibit_id = $neatline->id;
        }

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
     * Set all style attributes to null.
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
     * Get the parent item record.
     *
     * @return Omeka_record The parent item.
     */
    public function getItem()
    {

        $item = null;

        // Get item if non-null item_id.
        if (!is_null($this->item_id)) {
            $item = $this->getTable('Item')->find($this->item_id);
        }

        return $item;

    }


    /**
     * Get the parent exhibit record.
     *
     * @return Omeka_record The parent exhibit.
     */
    public function getExhibit()
    {
        return $this->getTable('NeatlineExhibit')
            ->find($this->exhibit_id);
    }


    /**
     * Get a style attribute.
     *
     * @param string $style The name of the style.
     * @return int|string The value.
     */
    public function getStyle($style)
    {
        return $this[$style];
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
            'vector_color'      => $this->getStyle('vector_color'),
            'stroke_color'      => $this->getStyle('stroke_color'),
            'select_color'      => $this->getStyle('select_color'),
            'vector_opacity'    => $this->getStyle('vector_opacity'),
            'select_opacity'    => $this->getStyle('select_opacity'),
            'stroke_opacity'    => $this->getStyle('stroke_opacity'),
            'image_opacity'     => $this->getStyle('image_opacity'),
            'stroke_width'      => $this->getStyle('stroke_width'),
            'point_radius'      => $this->getStyle('point_radius'),
            'point_image'       => $this->getStyle('point_image'),
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
     * Update the record.
     *
     * @param array $values The PUT values.
     */
    public function update($values)
    {

        // Pluck out coverage.
        $coverage = $values['coverage'];
        unset($values['coverage']);

        // Set remaining fields
        foreach ($values as $key => $val) $this->setNotEmpty($key, $val);
        $this->save($coverage);

    }


    /**
     * Before saving, point any NULL style tag references to the default
     * tag for the exhibit.
     */
    public function beforeSave()
    {

        // Get the exhibit default tag.
        $tagsTable = $this->getTable('NeatlineTag');
        $tag = $tagsTable->getExhibitDefault($this->getExhibit());

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


    /**
     * Call `delete` in a transaction.
     */
    public function deleteTransaction()
    {
        $db = get_db();
        $db->beginTransaction();
        try {
            $this->delete();
            $db->commit();
        } catch (Exception $e) {
            $db->rollback();
            throw $e;
        }
    }


}
