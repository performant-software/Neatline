<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Table class for NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_AbstractRecordTable extends Omeka_Db_Table
{


    /**
     * Get an array of all styleset tables that extend the record.
     *
     * @return array The array of styleset tables.
     */
    public function getStylesetTables()
    {
        return array();
    }


    /**
     * Join the styleset tables.
     *
     * @return Omeka_Db_Select $select The modified select.
     */
    public function getSelect()
    {

        $select = parent::getSelect();

        // Get the parent table alias.
        $parentAlias = $this->getTableAlias();

        // Walk styleset tables.
        foreach ($this->getStylesetTables() as $table) {

            // Get styleset alias and name.
            $stylesetAlias = $table->getTableAlias();
            $stylesetName  = $table->getTableName();

            // Join the styleset.
            $select->join(array($stylesetAlias => $stylesetName),
                "$parentAlias.id = $stylesetAlias.record_id"
            );

        }

        return $select;

    }


}
