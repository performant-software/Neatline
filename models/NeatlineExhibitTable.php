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
