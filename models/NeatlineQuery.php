<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineQuery
{


    /**
     * Set the select object and parameters array.
     *
     * @param Omeka_Db_Select $select A NeatlineRecordTable select.
     * @param array $params Query parameters.
     */
    public function __construct()
    {
        $this->select = $select;
        $this->params = $params;
        $this->result = array();
    }


    /**
     * Filter the select, post-process and return the result.
     *
     * @return array The result.
     */
    public function execute()
    {
        // TODO
    }


    // FILTERS
    // ------------------------------------------------------------------------


    /**
     * Filter on all supported query parameters.
     */
    protected function applyFilters()
    {
        foreach ($this->params as $param => $value) {
            if (method_exists($this, "filter_$param")) {
                $this->{"filter_param"}();
            }
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
        $this->select->where(
            "MBRIntersects(coverage, GeomFromText('$this->params['extent']'))"
        );
        $this->select->where("is_coverage = 1");
    }


    /**
     * Paginate the query.
     */
    protected function filter_limit()
    {

        // Set the offset on the result envelope.
        $this->result['offset'] = isset($this->params['offset']) ?
            $this->params['offset'] : 0;

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
        $this->select->order($this->params['column']);
    }


    // POST-PROCESSING
    // ------------------------------------------------------------------------


    /**
     * Count the total size of the result set.
     */
    protected function countResultSet()
    {

        // Strip off limit and columns.
        $this->select->reset(Zend_Db_Select::LIMIT_COUNT);
        $this->select->reset(Zend_Db_Select::LIMIT_OFFSET);
        $this->select->reset(Zend_Db_Select::COLUMNS);

        // Count the total result size.
        $this->result['count'] = $this->select->columns('COUNT(*)')->
            query()->fetchColumn();

    }


}
