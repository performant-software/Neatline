<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Table class for Neatline data records.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTable extends Omeka_Db_Table
{


    /**
     * Extend the default `getSelect`:
     * - Add a `wkt` column, which selects the raw value of `coverage`.
     * - For each of the style key columns, join on the tag value.
     *
     * @return Omeka_Db_Select The modified select.
     */
    public function getSelect()
    {

        // Get base select.
        $select = new Omeka_Db_Select($this->getDb()->getAdapter());

        // Columns.
        $select->from(
            array(
                'r' => "{$this->_db->prefix}neatline_records",
                't1' => "{$this->_db->prefix}neatline_tags",
                't2' => "{$this->_db->prefix}neatline_tags",
                't3' => "{$this->_db->prefix}neatline_tags",
                't4' => "{$this->_db->prefix}neatline_tags",
                't5' => "{$this->_db->prefix}neatline_tags",
                't6' => "{$this->_db->prefix}neatline_tags",
                't7' => "{$this->_db->prefix}neatline_tags",
                't8' => "{$this->_db->prefix}neatline_tags",
                't9' => "{$this->_db->prefix}neatline_tags",
                't10' => "{$this->_db->prefix}neatline_tags",
                't11' => "{$this->_db->prefix}neatline_tags",
                't12' => "{$this->_db->prefix}neatline_tags"
            ),
            array(
                'r.item_id',
                'r.exhibit_id',
                'r.tag_id',
                'r.slug',
                'r.slug',
                'r.title',
                'r.body',
                'r.tags',
                'r.map_active',
                'r.map_focus',
                'r.map_zoom',
                't1.vector_color',
                't2.stroke_color',
                't3.select_color',
                't4.vector_opacity',
                't5.select_opacity',
                't6.stroke_opacity',
                't7.image_opacity',
                't8.stroke_width',
                't8.point_radius',
                't10.point_image',
                't11.max_zoom',
                't12.min_zoom'
            )
        );

        // Add `wkt` column.
        $select->columns(array(
            'wkt' => new Zend_Db_Expr('AsText(r.coverage)')
        ));

        return $select;

    }


    /**
     * Count all active records in an exhibit.
     *
     * @param Omeka_record $exhibit The exhibit record.
     * @return integer The number of active records.
     */
    public function countActiveRecordsByExhibit($exhibit)
    {
        return $this->count(array(
            'exhibit_id' => $exhibit->id,
            'map_active' => 1
        ));
    }


    /**
     * Construct data array for individual record.
     *
     * @param int $id The record id.
     * @return array The record data.
     */
    public function queryRecord($id)
    {

        // Build the select.
        $select = $this->getSelect()->where('id=?', $id);

        // Query.
        $record = $this->fetchObject($select);
        return $record->buildJsonData($record->wkt);

    }


    /**
     * Construct records array for exhibit and editor.
     *
     * @param Omeka_Record_AbstractRecord $exhibit The exhibit record.
     *
     * Filter parameters:
     * ------------------
     * @param string $extent The current map viewport extent.
     * @param int $zoom The zoom level.
     *
     * @return array The collection of matching records.
     */
    public function queryRecords($exhibit, $extent=null, $zoom=null)
    {

        $data = array();

        // Build the select.
        $select = $this->getSelect()->where('exhibit_id=?', $exhibit->id);


        // Zoom.
        // -----
        if (!is_null($zoom)) {
            $select = $this->filterByZoom($select, $zoom);
        }


        // Extent.
        // -------
        if (!is_null($extent)) {
            $select = $this->filterByExtent($select, $extent);
        }


        // Get records.
        if ($records = $this->fetchObjects($select)) {

            // Construct record objects.
            foreach ($records as $record) {
                $data[] = $record->buildJsonData($record->wkt);
            }

        }

        return $data;

    }


    /**
     * Filter by zoom.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param integer $zoom The zoom level.
     * @return Omeka_Db_Select The filtered select.
     */
    protected function filterByZoom($select, $zoom)
    {
        $select->where('min_zoom IS NULL OR min_zoom<=?', $zoom);
        $select->where('max_zoom IS NULL OR max_zoom>=?', $zoom);
        return $select;
    }


    /**
     * Filter by extent.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param string $extent The extent, as a WKT polygon.
     * @return Omeka_Db_Select The filtered select.
     */
    protected function filterByExtent($select, $extent)
    {
        $select->where(new Zend_Db_Expr('MBRIntersects(
            coverage,GeomFromText("'.$extent.'"))'));
        return $select;
    }


}
