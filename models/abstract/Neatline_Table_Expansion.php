<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_Table_Expansion extends Omeka_Db_Table
{


    /**
     * Get an expansion row for a record.
     *
     * @param Neatline_Row_Expandable $parent The parent record.
     */
    public function findByParent($parent)
    {
        return $this->findBySql(
            'parent_id=?', array($parent->id), true
        );
    }


    /**
     * Delete an expansion row for a record.
     *
     * @param Neatline_Row_Expandable $parent The parent record.
     */
    public function deleteByParent($parent)
    {
        $expansion = $this->findByParent($parent);
        if ($expansion) $expansion->delete();
    }


    /**
     * Try to get an expansion row for a record. If none exists, create one.
     *
     * @param Neatline_Row_Expandable $parent The parent record.
     * @return Neatline_Row_Expansion $parent The expansion.
     */
    public function getOrCreate($parent)
    {

        // Try to return an existing row.
        $expansion = $this->findByParent($parent);
        if ($expansion) return $expansion;

        else {

            // Otherwise, create one.
            $class = $this->_target;
            return new $class($parent);

        }

    }


}
