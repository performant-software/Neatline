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


    // ------------------------------------------------------------------------
    // RECORDS API
    // ------------------------------------------------------------------------


    /**
     * Default query parameters.
     */
    protected static $defaultParams = array(
        'offset' => 0
    );


    /**
     * Construct records array for exhibit and editor.
     *
     * @param array $params Associative array of filter parameters.
     * @return array The collection of records.
     */
    public function queryRecords($params=array())
    {

        $this->select = $this->getSelect();
        $this->result = array('offset' => 0);

        // Merge default parameters.
        $this->params = array_merge(self::$defaultParams, $params);

        // ** BEFORE
        $this->applyFilters();

        // Execute the query.
        $this->result['records'] = $this->select->query()->fetchAll();

        // ** AFTER
        $this->excludeExisting();
        $this->countRecords();

        return $this->result;

    }


    // FILTERS
    // ------------------------------------------------------------------------


    /**
     * Filter on all supported query parameters.
     */
    protected function applyFilters()
    {
        foreach ($this->params as $param => $value) {
            $method = "filter_$param";
            if (method_exists($this, $method)) $this->$method();
        }
    }


    /**
     * Filter by exhibit.
     */
    protected function filter_exhibit_id()
    {
        $this->select->where("exhibit_id = ?", $this->params['exhibit_id']);
    }


    /**
     * Filter by zoom.
     */
    protected function filter_zoom()
    {
        $this->select->where(
            "min_zoom IS NULL OR min_zoom<=?", $this->params['zoom']
        );
        $this->select->where(
            "max_zoom IS NULL OR max_zoom>=?", $this->params['zoom']
        );
    }


    /**
     * Filter by extent. Omit records with no coverage data.
     */
    protected function filter_extent()
    {

        // Match intersection with the viewport.
        $this->select->where("MBRIntersects(coverage, GeomFromText(
            '{$this->params['extent']}'
        ))");

        // Omit records with empty coverages.
        $this->select->where("is_coverage = 1");

    }


    /**
     * Paginate the query.
     */
    protected function filter_limit()
    {

        // Set the offset on the result envelope.
        $this->result['offset'] = $this->params['offset'];

        // Apply the limit and offset.
        $this->select->limit($this->params['limit'], $this->result['offset']);

    }


    /**
     * Filter by keyword query.
     */
    protected function filter_query()
    {
        $this->select->where(
            "MATCH (title, body, slug) AGAINST (?)", $this->params['query']
        );
    }


    /**
     * Filter by tags query.
     */
    protected function filter_tags()
    {
        foreach ($this->params['tags'] as $tag) {
            $this->select->where(
                "MATCH (tags) AGAINST (? IN BOOLEAN MODE)", $tag
            );
        }
    }


    /**
     * Filter by widget query.
     */
    protected function filter_widget()
    {
        $this->select->where(
            "MATCH (widgets) AGAINST (? IN BOOLEAN MODE)",
            $this->params['widget']
        );
    }


    /**
     * Order the query.
     */
    protected function filter_order()
    {
        $this->select->reset(Zend_Db_Select::ORDER);
        $this->select->order($this->params['order']);
    }


    // POST-PROCESSING
    // ------------------------------------------------------------------------


    /**
     * Count the total, un-paginated size of the result set.
     */
    protected function countRecords()
    {

        // Strip off limit and columns.
        $this->select->reset(Zend_Db_Select::LIMIT_COUNT);
        $this->select->reset(Zend_Db_Select::LIMIT_OFFSET);
        $this->select->reset(Zend_Db_Select::COLUMNS);

        // Count the total result size.
        $this->result['count'] = $this->select->columns('COUNT(*)')->
            query()->fetchColumn();

    }


    /**
     * If an array of `existing` record ids is passed:
     *
     *  (1) REMOVE any records in the result set with ids in `existing`.
     *
     *  (2) If there are any ids in `existing` that are absent from the new
     *      result set, return those ids as an array under a `removed` key 
     */
    protected function excludeExisting()
    {

        if (isset($this->params['existing'])) {

            $omittedIds = array();
            $newRecords = array();

            foreach ($this->result['records'] as $record) {

                // If the record is new, add it to the result set.
                if (!in_array($record['id'], $this->params['existing'])) {
                    $newRecords[] = $record;
                }

                // Otherwise, register duplicate.
                else $omittedIds[] = $record['id'];

            }

            // Return the list of removed ids.
            $removed = array_diff($this->params['existing'], $omittedIds);
            $this->result['removed'] = array_values($removed);

            // Just return the new records.
            $this->result['records'] = $newRecords;

        }

    }


}
