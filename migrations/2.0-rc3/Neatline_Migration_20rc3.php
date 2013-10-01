<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_Migration_20rc3 extends Neatline_Migration_Abstract
{


    /**
     * Migrate to `2.0-rc3`.
     */
    public function migrate()
    {
        $this->_addFulltextIndexes();
    }


    /**
     * Rebuild fulltext indexes. This repairs old versions of the record table
     * installation that indexed all of the text fields together, which caused
     * queries against just _some_ of the fields to fail.
     */
    private function _addFulltextIndexes()
    {

        $this->db->query(<<<SQL
        ALTER TABLE {$this->db->prefix}neatline_records
        ADD FULLTEXT(title, body, slug);
SQL
);

        $this->db->query(<<<SQL
        ALTER TABLE {$this->db->prefix}neatline_records
        ADD FULLTEXT(tags);
SQL
);

        $this->db->query(<<<SQL
        ALTER TABLE {$this->db->prefix}neatline_records
        ADD FULLTEXT(widgets);
SQL
);

    }


}
