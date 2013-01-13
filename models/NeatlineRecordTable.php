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
     * Update records in an exhibit according to the value-defined style
     * definitions in the `styles` YAML. For example, if `styles` is:
     *
     * tag:
     *  - vector_color: #ffffff
     *  - stroke_color
     *
     *  The vector color on records tagged with `tag` will be updated to
     *  #ffffff, but the stroke color will be unchanged since no explicit
     *  value is set in the YAML.
     *
     * @param NeatlineExhibit The exhibit to update.
     */
    public function applyStyles($exhibit)
    {

        $yaml   = Spyc::YAMLLoad($exhibit->styles);
        $valid  = neatline_getStyleCols();

        // Walk tags.
        foreach ($yaml as $tag => $styles) {

            // `WHERE`
            $where = array(
                'exhibit_id = ?' => $exhibit->id,
                'tags REGEXP ?' => '[[:<:]]'.$tag.'[[:>:]]'
            );

            // `SET`
            $set = array();
            foreach ($styles as $style) {
                if (is_array($style)) {
                    foreach ($style as $s => $v) {
                        if (in_array($s, $valid)) {
                            $set[$s] = $v;
                        }
                    }
                }
            }

            $this->update($this->getTableName(), $set, $where);

        }

    }


    /**
     * Synchronize the tag-siblings of a record to match the values on the
     * passed record. For example, if `styles` on the exhibit it:
     *
     * tag:
     *  - vector_color: #ffffff
     *  - stroke_color
     *
     *  The stroke color on records tagged with `tag` will be updated to
     *  the value on the passed record, but vector color will be unchanged
     *  since an explicit value is set in the YAML.
     *
     * @param NeatlineRecord The record to propagate.
     */
    public function syncStyles($record)
    {

    }


    /**
     * Select `coverage` as plain-text.
     *
     * @return Omeka_Db_Select The modified select.
     */
    public function getSelect()
    {
        return parent::getSelect()->columns(array(
            'coverage' => new Zend_Db_Expr(
                'NULLIF(AsText(coverage), "POINT(0 0)")'
            )
        ));
    }


    /**
     * Count the number of active records in an exhibit.
     *
     * @param NeatlineExhibit $exhibit The exhibit record.
     * @return int The number of active records.
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
        return $this->fetchObject(
            $this->getSelect()->where('id=?', $id)
        )->buildJsonData();
    }


    /**
     * Construct records array for exhibit and editor.
     *
     * @param NeatlineExhibit $exhibit The exhibit record.
     * @param string $extent The viewport extent.
     * @param int $zoom The zoom level.
     * @return array The collection of records.
     */
    public function queryRecords($exhibit, $extent=null, $zoom=null)
    {

        $select = $this->getSelect();
        $data = array();

        // Exhibit.
        $select = $this->_filterByExhibit($select, $exhibit);

        // Zoom.
        if (!is_null($zoom)) {
            $select = $this->_filterByZoom($select, $zoom);
        }

        // Extent.
        if (!is_null($extent)) {
            $select = $this->_filterByExtent($select, $extent);
        }

        if ($records = $this->fetchObjects($select)) {
            foreach ($records as $record) {
                $data[] = $record->buildJsonData();
            }
        }

        return $data;

    }


    /**
     * Filter by exhibit.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param NeatlineExhibit $exhibit The exhibit.
     * @return Omeka_Db_Select The filtered select.
     */
    public function _filterByExhibit($select, $exhibit)
    {
        return $select->where('exhibit_id = ?', $exhibit->id);
    }


    /**
     * Filter by zoom.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param integer $zoom The zoom level.
     * @return Omeka_Db_Select The filtered select.
     */
    public function _filterByZoom($select, $zoom)
    {
        $select->where("min_zoom IS NULL OR min_zoom<=?", $zoom);
        $select->where("max_zoom IS NULL OR max_zoom>=?", $zoom);
        return $select;
    }


    /**
     * Filter by extent.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param string $extent The extent, as a WKT polygon.
     * @return Omeka_Db_Select The filtered select.
     */
    public function _filterByExtent($select, $extent)
    {

        // Query for viewport intersection.
        $select->where(new Zend_Db_Expr("MBRIntersects(
            coverage, GeomFromText('$extent')
        )"));

        // Omit records at POINT(0 0).
        $select->where(new Zend_Db_Expr(
            "AsText(coverage) != 'POINT(0 0)'"
        ));

        return $select;

    }


    /**
     * Filter by tag.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param string $tag The tag.
     * @return Omeka_Db_Select The filtered select.
     */
    public function _filterByTag($select, $tag)
    {
        return $select->where(new Zend_Db_Expr(
            "tags REGEXP '[[:<:]]".$tag."[[:>:]]'"
        ));
    }


}
