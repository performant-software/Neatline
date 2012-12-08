<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

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
     * The title for the record.
     * mediumtext COLLATE utf8_unicode_ci NULL
     */
    public $title;

    /**
     * An exhibit-unique plaintext identifier for the record.
     * varchar(100) NULL
     */
    public $slug;

    /**
     * A plaintext description for the record.
     * mediumtext COLLATE utf8_unicode_ci NULL
     */
    public $description;

    /**
     * KML for geometries.
     * mediumtext COLLATE utf8_unicode_ci NULL
     */
    public $coverage;

    /**
     * Boolean for whether the record is present on the map.
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
     * Maximum map zoom level.
     * int(10) unsigned NULL
     */
    public $max_zoom;

    /**
     * Minimum map zoom level.
     * int(10) unsigned NULL
     */
    public $min_zoom;

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
    public $select_color;

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

    /**
     * Default attributes.
     */
    private static $defaults = array(
        'left_percent' => 0,
        'right_percent' => 100,
        'coverage' => ''
    );

    /**
     * Valid style attribute names.
     */
    private static $styles = array(
        'vector_color',
        'vector_opacity',
        'stroke_color',
        'stroke_opacity',
        'stroke_width',
        'select_opacity',
        'graphic_opacity',
        'point_radius',
        'select_color'
    );


    /**
     * Instantiate and foreign keys.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return Omeka_record $this.
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

        $this->_parent = null;
        $this->_exhibit = null;

    }


    /**
     * Setters.
     */


    /**
     * Set the an attribute if the passed value is not null or ''.
     *
     * @param string $attribute The name of the attribute.
     * @param boolean $value The value to set.
     *
     * @return void.
     */
    public function setNotEmpty($attribute, $value)
    {
        if ($value == '') $this[$attribute] = null;
        else $this[$attribute] = $value;
    }

    /**
     * Set the slug if it is unique.
     *
     * @param boolean $slug The slug.
     *
     * @return void.
     */
    public function setSlug($slug)
    {

        // Get records table and exhibit.
        $recordsTable = $this->getTable('NeatlineRecord');
        $exhibit = $this->getExhibit();

        // Set the record value if it is unique.
        if ($recordsTable->slugIsAvailable($this, $exhibit, $slug)) {
            $this->slug = $slug;
        }

    }

    /**
     * Set all style attributes to null.
     *
     * @param string $wkt The coverage, as WKT GEOMETRYCOLLECTION.
     *
     * @return void.
     */
    public function setCoverage($wkt)
    {

        $sql = "UPDATE `{$this->_db->prefix}neatline_records`
                SET coverage = GeomFromText('{$wkt}')
                WHERE id = {$this->id}";

        $this->_db->query($sql);

    }

    /**
     * Set all style attributes to null.
     *
     * @return void.
     */
    public function resetStyles()
    {
        $this->vector_color =       null;
        $this->stroke_color =       null;
        $this->select_color =       null;
        $this->vector_opacity =     null;
        $this->stroke_opacity =     null;
        $this->graphic_opacity =    null;
        $this->stroke_width =       null;
        $this->point_radius =       null;
        $this->point_image =        null;
    }


    /**
     * Getters.
     */


    /**
     * Get the parent item record.
     *
     * @return Omeka_record $item The parent item.
     */
    public function getItem()
    {

        $item = null;

        // If record id is defined, get item.
        if (!is_null($this->item_id)) {
           $item = $this->getTable('Item')->find($this->item_id);
        }

        return $item;

    }

    /**
     * Get the parent exhibit record.
     *
     * @return Omeka_record $exhibit The parent exhibit.
     */
    public function getExhibit()
    {

        if (is_null($this->_exhibit)) {
            $this->_exhibit = $this->getTable('NeatlineExhibit')
                ->find($this->exhibit_id);
        }

        return $this->_exhibit;

    }

    /**
     * Get a style attribute.
     *
     * @param string style The name of the style.
     *
     * @return mixed The value.
     */
    public function getStyle($style)
    {
        return $this[$style];
    }

    /**
     * Assemble record data for the front-end application.
     *
     * @param string $coverage The coverage as plaintext WKT.
     *
     * @return array The map JSON.
     **/
    public function buildJsonData($coverage=null) {

        $data = array(

            // Relations:
            'id'                => $this->id,
            'item_id'           => $this->item_id,

            // Text:
            'title'             => $this->title,
            'description'       => $this->description,
            'slug'              => $this->slug,

            // Styles:
            'vector_color'      => $this->getStyle('vector_color'),
            'stroke_color'      => $this->getStyle('stroke_color'),
            'select_color'      => $this->getStyle('select_color'),
            'vector_opacity'    => $this->getStyle('vector_opacity'),
            'select_opacity'    => $this->getStyle('select_opacity'),
            'stroke_opacity'    => $this->getStyle('stroke_opacity'),
            'graphic_opacity'   => $this->getStyle('graphic_opacity'),
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
     *
     * @return void.
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
     * On save, update the modified column on the parent exhibit. If string
     * $coverage is passed, run the coverage update.
     *
     * @return void.
     */
    public function save($coverage = null)
    {

        parent::save();

        // Set `modified` on parent.
        if (!is_null($this->exhibit_id)) {
            $exhibit = $this->getExhibit();
            $exhibit->save();
        }

        // Update `coverage`.
        if (!is_null($coverage)) {
            $this->setCoverage($coverage);
        }

    }

    /**
     * Call `delete` in a transaction.
     *
     * @return void
     **/
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
