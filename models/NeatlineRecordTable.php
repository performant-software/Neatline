<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Table class for records.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTable extends Omeka_Db_Table
{


    /**
     * Select `coverage` as plain-text and order by creation date.
     *
     * @return Omeka_Db_Select The modified select.
     */
    public function getSelect()
    {

        $select = parent::getSelect();

        // Select raw `coverage`.
        $select->columns(array('coverage' => new Zend_Db_Expr(
            'NULLIF(AsText(coverage), "POINT(0 0)")'
        )));

        // Order chronologically.
        $select->order('added DESC');

        return $select;

    }


    /**
     * Update record item references when an item is changed.
     *
     * @param Item $item The item record.
     */
    public function syncItem($item)
    {
        $records = $this->findBySql('item_id=?', array($item->id));
        foreach ($records as $record) { $record->save(); }
    }


    /**
     * Construct data array for individual record.
     *
     * @param int $id The record id.
     * @return array The record data.
     */
    public function queryRecord($id)
    {
        $alias  = $this->getTableAlias();
        $select = $this->getSelect()->where("$alias.id=?", $id);
        return $this->_db->fetchRow($select);
    }


    /**
     * Construct records array for exhibit and editor.
     *
     * @param NeatlineExhibit $exhibit The exhibit record.
     * @param array $params Associative array of filter parameters:
     *
     *  - zoom:     The zoom level of the map.
     *  - extent:   The viewport extent of the map.
     *  - query:    A full-text search query.
     *  - tags:     An array of tags.
     *  - offset:   The number of records to skip.
     *  - limit:    The number of records to get.
     *
     * @return array The collection of records.
     */
    public function queryRecords($exhibit, $params=array())
    {

        $data = array('records' => array(), 'offset' => 0);
        $select = $this->getSelect();

        // Filter by exhibit.
        $select = $this->_filterByExhibit($select, $exhibit);

        // ** Zoom
        if (isset($params['zoom'])) {
            $select = $this->_filterByZoom($select,
                $params['zoom']
            );
        }

        // ** Extent
        if (isset($params['extent'])) {
            $select = $this->_filterByExtent($select,
                $params['extent']
            );
        }

        // ** Keywords
        if (isset($params['query'])) {
            $select = $this->_filterByKeywords($select,
                $params['query']
            );
        }

        // ** Tags
        if (isset($params['tags'])) {
            $select = $this->_filterByTags($select,
                $params['tags']
            );
        }

        // ** Limit
        if (isset($params['limit']) && isset($params['offset'])) {
            $data['offset'] = $params['offset'];
            $select = $this->_filterByLimit($select,
                $params['limit'],
                $params['offset']
            );
        }

        // Execute query.
        $data['records'] = $select->query()->fetchAll();

        // Strip off limit and columns.
        $select->reset(Zend_Db_Select::LIMIT_COUNT);
        $select->reset(Zend_Db_Select::LIMIT_OFFSET);
        $select->reset(Zend_Db_Select::COLUMNS);

        // Count the total result size.
        $data['count'] = $select->columns('COUNT(*)')->
            query()->fetchColumn();

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
        return $select->where("exhibit_id = ?", $exhibit->id);
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

        $wms = "(wms_address IS NOT NULL AND wms_layers IS NOT NULL)";

        // Query for viewport intersection.
        $select->where(new Zend_Db_Expr(
            "MBRIntersects(coverage, GeomFromText('$extent')) OR $wms"
        ));

        // Omit records at POINT(0 0).
        $select->where(new Zend_Db_Expr(
            "AsText(coverage) != 'POINT(0 0)' OR $wms"
        ));

        return $select;

    }


    /**
     * Paginate the query.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param int $offset The starting offset.
     * @param int $limit The number of records to select.
     * @return Omeka_Db_Select The filtered select.
     */
    public function _filterByLimit($select, $limit, $offset)
    {
        return $select->limit($limit, $offset);
    }


    /**
     * Filter by keyword query.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param string $query The search query.
     * @return Omeka_Db_Select The filtered select.
     */
    public function _filterByKeywords($select, $query)
    {
        $select->where(
            "MATCH (title, body) AGAINST (? IN BOOLEAN MODE)", $query);
        return $select;
    }


    /**
     * Filter by tag query.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param array $tags An array of tags.
     * @return Omeka_Db_Select The filtered select.
     */
    public function _filterByTags($select, $tags)
    {
        foreach ($tags as $tag) {
            $select->where("tags REGEXP ?", "[[:<:]]".$tag."[[:>:]]");
        }
        return $select;
    }


}
