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
     * Propagate new values to records with shared tags.
     *
     * @param NeatlineRecord $record The record to propagate.
     */
    public function propagateTags($record)
    {

        $tagsTable  = $this->getTable('NeatlineTag');
        $exhibit    = $record->getExhibit();

        // Gather taggable columns.
        $attrs = neatline_getStyleCols();

        // Explode tags.
        foreach (neatline_explodeTags($record->tags) as $raw) {

            // Get the tag record.
            $tag    = $tagsTable->findByName($exhibit, $raw);
            $where  = array('tags LIKE ?' => '%'.$raw.'%');
            $data   = array();

            // Get update data array.
            foreach ($attrs as $attr) { if ($tag->$attr == 1) {
                $data[$attr] = $record->$attr;
            }}

            // Update sibling records.
            $this->update($this->getTableName(), $data, $where);

        }

    }


    /**
     * Update a tag.
     *
     * @param NeatlineExhibit $exhibit The exhibit record.
     * @param string $oldName The current tag name.
     * @param string $newName The new tag name.
     */
    public function updateTag($exhibit, $oldName, $newName)
    {

        // Form the `REPLACE` call.
        $replace = $this->quoteInto('REPLACE(tags, ?)',
            array($oldName, $newName));

        // Form `SET` and `WHERE`.
        $data   = array('tags' => new Zend_Db_Expr($replace));
        $where  = array('tags LIKE ?' => '%'.$oldName.'%');

        // Update records.
        $this->update($this->getTableName(), $data, $where);

    }


    /**
     * Delete a tag.
     *
     * @param NeatlineExhibit $exhibit The exhibit record.
     * @param string $oldName The current tag name.
     * @param string $newName The new tag name.
     */
    public function deleteTag($exhibit, $name)
    {

        // Form the `REPLACE` call.
        $replace1 = $this->quoteInto("REPLACE(tags, ?)",
            array($name, ""));
        $replace2 = $this->quoteInto("REPLACE({$replace1}, ?)",
            array(",,", ","));

        // Trim trailing/leading commas.
        $trim = "TRIM(BOTH ',' FROM {$replace2})";

        // Form `SET` and `WHERE`.
        $data   = array('tags' => new Zend_Db_Expr($trim));
        $where  = array('tags LIKE ?' => '%'.$name.'%');

        // Update records.
        $this->update($this->getTableName(), $data, $where);

    }


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
            'coverage' => new Zend_Db_Expr('AsText(coverage)'))
        );
    }


    /**
     * Count the number of active records in an exhibit.
     *
     * @param NeatlineExhibit $exhibit The exhibit record.
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
        return $record->buildJsonData();

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

        // Form starting select.
        $select = $this->getSelect()->where(
            'exhibit_id=?', $exhibit->id
        );

        // Zoom.
        if (!is_null($zoom)) {
            $select = $this->_filterByZoom($select, $zoom);
        }

        // Extent.
        if (!is_null($extent)) {
            $select = $this->_filterByExtent($select, $extent);
        }

        // Get records.
        if ($records = $this->fetchObjects($select)) {
            foreach ($records as $record) {
                $data[] = $record->buildJsonData();
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
    protected function _filterByZoom($select, $zoom)
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
    protected function _filterByExtent($select, $extent)
    {

        // Query for intersection with the viewport.
        $select->where(new Zend_Db_Expr('MBRIntersects(
            coverage, GeomFromText("'.$extent.'")
        )'));

        return $select;

    }


}
