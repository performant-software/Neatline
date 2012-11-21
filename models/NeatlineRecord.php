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
     * Minimum coverage extent.
     * POLYGON NOT NULL
     */
    public $bounds;

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
     * The start date.
     * tinytext COLLATE utf8_unicode_ci NULL
     */
    public $start_date;

    /**
     * The end date.
     * tinytext COLLATE utf8_unicode_ci NULL
     */
    public $end_date;

    /**
     * The date after which the record is visible.
     * tinytext COLLATE utf8_unicode_ci NULL
     */
    public $start_visible_date;

    /**
     * The date before which the record is visible.
     * tinytext COLLATE utf8_unicode_ci NULL
     */
    public $end_visible_date;

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
     * DC Date regular expression.
     */
    private static $dcDateRegex =
        '/^(?P<start>[0-9:\-\s]+)(\/(?P<end>[0-9:\-\s]+))?/';


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

        // Get records table.
        $_recordsTable = $this->getTable('NeatlineRecord');

        // Set the record value if it is unique.
        if ($_recordsTable->slugIsAvailable($this, $this->getExhibit(), $slug)) {
            $this->slug = $slug;
        }

    }

    /**
     * Set the `bounds` attribute with PolyFromText().
     *
     * @param string $bounds The bounds, as a WKT polygon.
     *
     * @return void.
     */
    public function setBounds($bounds)
    {
        $this->bounds = new Zend_Db_Expr("PolyFromText('$bounds')");
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
     * Return coverage.
     *
     * @return string The coverage data. If there is record-specific data,
     * return it. If not, and there is a parent Omeka item, try to get a non-
     * empty value from the DC coverage field.
     */
    public function getGeocoverage()
    {

        // Return local value if one exists.
        if (!is_null($this->coverage) && $this->coverage !== '') {
            return $this->coverage;
        }

        // Try to get DC value.
        else if (!is_null($this->item_id)) {

            // If Neatline Features is not installed.
            if (!plugin_is_active('NeatlineFeatures')) {

                // Get the DC coverage.
                $coverage = metadata(
                    $this->getItem(), array('Dublin Core', 'Coverage'));

                // Return if not empty, otherwise return default.
                return ($coverage !== '') ?
                    $coverage : self::$defaults['coverage'];

            }

            // If Neatline Features is installed.
            else {

                // Get feature records.
                $features = $this->getTable('NeatlineFeature')
                    ->getItemFeatures($this->getItem());

                // Walk features and build array.
                $wkt = array();
                foreach ($features as $feature) {

                    // Push wkt if not null or empty.
                    if (!is_null($feature->wkt) && $feature->wkt !== '') {
                        $wkt[] = $feature->wkt;
                    }

                    // If at least one feature exists, implode and return.
                    if (count($wkt)) return implode('|', $wkt);
                    else return self::$defaults['coverage'];

                }

            }

        }

        // Fall back on default string.
        else return self::$defaults['coverage'];

    }

    /**
     * Assemble record data for the front-end application.
     *
     * @param array $index This is the index of NeatlineRecord objects for
     * caching. Optional.
     * @param array $wmss This is an index mapping item IDs to rows from the
     * NeatlineMapsService WMS data.
     *
     * @return array The map JSON.
     **/
    public function buildJsonData($index=array(), $wmss=array()) {

        $data = array(

            // Relations:
            'id'                  => $this->id,
            'item_id'             => $this->item_id,

            // Text:
            'title'               => $this->title,
            'description'         => $this->description,
            'slug'                => $this->slug,

            // Styles:
            'vector_color'        => $this->getStyle('vector_color'),
            'stroke_color'        => $this->getStyle('stroke_color'),
            'select_color'        => $this->getStyle('select_color'),
            'vector_opacity'      => $this->getStyle('vector_opacity'),
            'select_opacity'      => $this->getStyle('select_opacity'),
            'stroke_opacity'      => $this->getStyle('stroke_opacity'),
            'graphic_opacity'     => $this->getStyle('graphic_opacity'),
            'stroke_width'        => $this->getStyle('stroke_width'),
            'point_radius'        => $this->getStyle('point_radius'),
            'point_image'         => $this->getStyle('point_image'),

            // Map:
            'map_focus'           => $this->map_focus,
            'map_zoom'            => $this->map_zoom,
            'coverage'            => $this->getGeocoverage(),
            'wmsAddress'          => null,
            'layers'              => null,

            // Statuses:
            'map_active'          => $this->map_active

        );

        // If the record has a parent item and Neatline Maps is present.
        if (!is_null($this->item_id) && array_key_exists($this->item_id, $wmss)) {
            $wms = $wmss[$this->item_id];
            $data['wmsAddress'] = $wms['address'];
            $data['layers']     = $wms['layers'];
        }

        return $data;

    }

    /**
     * On save, update the modified column on the parent exhibit and set
     * a default bounds value if one does not exist.
     *
     * @return void.
     */
    public function save()
    {

        // Set `modified` on parent.
        if (!is_null($this->exhibit_id)) {
            $exhibit = $this->getExhibit();
            $exhibit->save();
        }

        parent::save();

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
