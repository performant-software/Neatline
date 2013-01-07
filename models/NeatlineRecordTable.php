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
     * Extend the default `getSelect` to add a `wkt` column to all queries
     * that selects the plain-text value of `coverage` by way of `AsText`.
     *
     * @return Omeka_Db_Select The modified select.
     */
    public function getSelect()
    {
        $select = parent::getSelect();
        return $select->columns(array(
            'wkt' => new Zend_Db_Expr('AsText(coverage)'))
        );
    }


    /**
     * Count the number of active records in an exhibit.
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
