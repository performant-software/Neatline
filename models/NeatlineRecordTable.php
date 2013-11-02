<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTable extends Neatline_Table_Expandable
{


    /**
     * Gather expansion tables.
     *
     * @return array The tables.
     */
    public function getExpansionTables()
    {
        return nl_getRecordExpansions();
    }


    /**
     * Get a starting selection object for record queries.
     *
     * @return Omeka_Db_Select The modified select.
     */
    public function getSelect()
    {

        $select = parent::getSelect();

        // Select `coverage` as plaintext.
        $select->columns(array('coverage' => nl_getGeometry('coverage')));

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
     * Construct records array for exhibit and editor.
     *
     * @param NeatlineExhibit $exhibit The exhibit record.
     * @param array $params Associative array of filter parameters:
     *
     *  - zoom:     The zoom level of the map.
     *  - extent:   The viewport extent of the map.
     *  - query:    A full-text search query.
     *  - tags:     An array of tags.
     *  - widget:   A record widget activation.
     *  - order:    A column to sort on.
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
        $this->filterByExhibit($select, $exhibit);

        // ** Zoom
        if (isset($params['zoom'])) {
            $this->filterByZoom($select, $params['zoom']);
        }

        // ** Extent
        if (isset($params['extent'])) {
            $this->filterByExtent($select, $params['extent']);
        }

        // ** Query
        if (isset($params['query'])) {
            $this->filterByKeywords($select, $params['query']);
        }

        // ** Tags
        if (isset($params['tags'])) {
            $this->filterByTags($select, $params['tags']);
        }

        // ** Widget
        if (isset($params['widget'])) {
            $this->filterByWidget($select, $params['widget']);
        }

        // ** Order
        if (isset($params['order'])) {
            $this->filterByOrder($select, $params['order']);
        }

        // ** Limit
        if (isset($params['limit'])) {
            $offset = isset($params['offset']) ? $params['offset'] : 0;
            $this->filterByLimit($select, $params['limit'], $offset);
            $data['offset'] = $offset;
        }

        // Pass select to plugins for modification.
        $select = apply_filters('neatline_query_records', $select, array(
            'params' => $params
        ));

        // Execute query.
        $data['records'] = $select->query()->fetchAll();

        // Strip off limit and columns.
        $select->reset(Zend_Db_Select::LIMIT_COUNT);
        $select->reset(Zend_Db_Select::LIMIT_OFFSET);
        $select->reset(Zend_Db_Select::COLUMNS);

        // Count the total result size.
        $data['count'] = $select->columns('COUNT(*)')->query()->fetchColumn();

        return $data;

    }


    /**
     * Filter by exhibit.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param NeatlineExhibit $exhibit The exhibit.
     */
    public function filterByExhibit($select, $exhibit)
    {
        $select->where("exhibit_id = ?", $exhibit->id);
    }


    /**
     * Filter by zoom.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param integer $zoom The zoom level.
     */
    public function filterByZoom($select, $zoom)
    {
        $select->where("min_zoom IS NULL OR min_zoom<=?", $zoom);
        $select->where("max_zoom IS NULL OR max_zoom>=?", $zoom);
    }


    /**
     * Filter by extent.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param string $extent The extent, as a WKT polygon.
     */
    public function filterByExtent($select, $extent)
    {

        // Match viewport intersection.
        $select->where("MBRIntersects(coverage, GeomFromText('$extent'))");

        // Omit empty coverages.
        $select->where("is_coverage = 1");

    }


    /**
     * Order the query.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param string $column The column to order on.
     */
    public function filterByOrder($select, $column)
    {
        $select->reset(Zend_Db_Select::ORDER);
        $select->order($column);
    }


    /**
     * Paginate the query.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param int $offset The starting offset.
     * @param int $limit The number of records to select.
     */
    public function filterByLimit($select, $limit, $offset)
    {
        $select->limit($limit, $offset);
    }


    /**
     * Filter by keyword query.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param string $query The search query.
     */
    public function filterByKeywords($select, $query)
    {
        $select->where(
            "MATCH (title, body, slug) AGAINST (?)",
            $query
        );
    }


    /**
     * Filter by tags query.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param array $tags An array of tags.
     */
    public function filterByTags($select, $tags)
    {
        foreach ($tags as $tag) {
            $select->where(
                "MATCH (tags) AGAINST (? IN BOOLEAN MODE)",
                $tag
            );
        }
    }


    /**
     * Filter by widget query.
     *
     * @param Omeka_Db_Select $select The starting select.
     * @param string $widget A widget id.
     */
    public function filterByWidget($select, $widget)
    {
        $select->where(
            "MATCH (widgets) AGAINST (? IN BOOLEAN MODE)",
            $widget
        );
    }


}
