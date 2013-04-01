<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Table class for stylable records.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_StylableTable extends Omeka_Db_Table
{


    /**
     * Get an array of all styleset tables that extend the record.
     *
     * @return array The array of styleset tables.
     */
    abstract public function getStylesetTables();


    /**
     * Join the styleset tables.
     *
     * @return Omeka_Db_Select $select The modified select.
     */
    public function getSelect()
    {

        $select = parent::getSelect();

        // Get the parent table alias.
        $pAlias = $this->getTableAlias();

        // Join styleset tables.
        foreach ($this->getStylesetTables() as $table) {
            $sAlias = $table->getTableAlias();
            $sName  = $table->getTableName();
            $select->join(array($sAlias => $sName),
                "$pAlias.id = $sAlias.record_id"
            );
        }

        return $select;

    }


}
