<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_ExpandableRow extends Neatline_AbstractRow
{


    /**
     * Update expansions after saving.
     *
     * @param boolean $throwIfInvalid
     */
    public function save($throwIfInvalid = true)
    {

        parent::save($throwIfInvalid);

        // Gather expansion tables.
        $expansions = $this->getTable()->getExpansionTables();
        if (!$expansions) return;

        // Create or update expansions.
        foreach ($expansions as $expansion) {
            $row = $expansion->getOrCreate($this);
            $row->setArray($this->toArrayForSave());
            $row->save();
        }

    }

}
