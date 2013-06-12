<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibitTable extends Neatline_Table_Expandable
{


    /**
     * Gather expansion tables.
     *
     * @return array The tables.
     */
    public function getExpansionTables()
    {
        return nl_getExhibitExpansions();
    }


    /**
     * Add public/private filtering to exhibit queries.
     *
     * @return Omeka_Db_Select The filtered select.
     */
    public function getSelect()
    {

        $select = parent::getSelect();

        // Hide non-public exhibits from anonymous users.
        if (!is_allowed('Neatline_Exhibits', 'showPrivate')) {
            $select->where('public=1');
        }

        return $select;

    }


    /**
     * Find exhibit by slug.
     *
     * @param string $slug The slug.
     * @return Omeka_record The exhibit.
     */
    public function findBySlug($slug)
    {
        return $this->findBySql('slug=?', array($slug), true);
    }


}
