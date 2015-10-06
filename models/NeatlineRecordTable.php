<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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

        // Order by date created.
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


    // RECORDS API
    // ------------------------------------------------------------------------


    /**
     * Construct records array for exhibit and editor.
     *
     * @param array $params Associative array of filter parameters.
     * @return array The collection of records.
     */
    public function queryRecords($params=array())
    {

        $this->params = $params;
        $this->select = $this->getSelect();
        $this->result = array();

        $this->beforeQuery();
        $this->result['records'] = $this->select->query()->fetchAll();
        $this->afterQuery();

        return $this->result;

    }


    /**
     * Prepare the select.
     */
    public function beforeQuery()
    {
        $this->filterExhibit();
        $this->filterZoom();
        $this->filterExtent();
        $this->filterLimit();
        $this->filterTags();
        $this->filterQuery();
        $this->filterWidget();
        $this->filterOrder();
        $this->filterHasSlug();
        $this->filterHasDate();
        $this->filterPlugins();
    }


    /**
     * Process the result.
     */
    public function afterQuery()
    {
        $this->countRecords();
    }


    // FILTERS
    // ------------------------------------------------------------------------


    /**
     * Filter by exhibit.
     */
    protected function filterExhibit()
    {
        if (isset($this->params['exhibit_id'])) {

            $this->select->where(
                "exhibit_id = ?", $this->params['exhibit_id']
            );

        }
    }


    /**
     * Filter by zoom.
     */
    protected function filterZoom()
    {
        if (isset($this->params['zoom'])) {

            // Min zoom:
            $this->select->where(
                "min_zoom IS NULL OR min_zoom<=?", $this->params['zoom']
            );

            // Max zoom:
            $this->select->where(
                "max_zoom IS NULL OR max_zoom>=?", $this->params['zoom']
            );

        }
    }


    /**
     * Filter by extent, ommitting records with the de-facto null `POINT(0 0)`
     * coverage. Always match records with WMS addresses, though, even if they
     * do not have coverages that intersect with the viewport, since the WMS
     * layers always need to be displayed if the layer falls inside the zoom
     * visibility interval of the record.
     */
    protected function filterExtent()
    {
        if (isset($this->params['extent'])) {

            $bb = $this->params['extent'];

            $this->select->where(
                "MBRIntersects(coverage, GeomFromText('$bb')) OR
                is_wms = 1" // Always match WMS layers.
            );

            // Omit records with empty coverages.
            $this->select->where("is_coverage = 1 OR is_wms = 1");

        }
    }


    /**
     * Paginate the query, set the start offset on the result array.
     */
    protected function filterLimit()
    {

        // Set the paging offset on the result.
        $start = isset($this->params['start']) ? $this->params['start'] : 0;
        $this->result['start'] = $start;

        // If passed, apply the limit.
        if (isset($this->params['limit'])) {
            $this->select->limit($this->params['limit'], $start);
        }

    }


    /**
     * Filter by tags query.
     */
    protected function filterTags()
    {
        if (isset($this->params['tags'])) {

            foreach ($this->params['tags'] as $tag) {
                $this->select->where(
                    "MATCH (tags) AGAINST (? IN BOOLEAN MODE)",
                    $tag
                );
            }

        }
    }


    /**
     * Filter by keyword query.
     */
    protected function filterQuery()
    {
        if (isset($this->params['query'])) {

            $this->select->where(
                "MATCH (item_title, title, body, slug) AGAINST (?)",
                $this->params['query']
            );

        }
    }


    /**
     * Filter by widget query.
     */
    protected function filterWidget()
    {
        if (isset($this->params['widget'])) {

            $this->select->where(
                "MATCH (widgets) AGAINST (? IN BOOLEAN MODE)",
                $this->params['widget']
            );

        }
    }


    /**
     * Order the query.
     */
    protected function filterOrder()
    {
        if (isset($this->params['order'])) {

            $this->select->reset(Zend_Db_Select::ORDER);
            $this->select->order($this->params['order']);

        }
    }


    /**
     * Match records with slugs.
     */
    protected function filterHasSlug()
    {
        if (isset($this->params['hasSlug'])) {

            $this->select->where('slug IS NOT NULL');

        }
    }


    /**
     * Match records with dates.
     */
    protected function filterHasDate()
    {
        if (isset($this->params['hasDate'])) {

            $this->select->where(
                'start_date IS NOT NULL OR end_date IS NOT NULL'
            );

        }
    }


    /**
     * Pass the select to plugins for modification.
     */
    protected function filterPlugins()
    {
        $this->select = apply_filters('neatline_query_records',
            $this->select, array('params' => $this->params)
        );
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
        $this->result['numFound'] = $this->select->columns('COUNT(*)')->
            query()->fetchColumn();

    }


}
