<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_Row_Expandable extends Neatline_Row_Abstract
{


    private $expansions = array();


    /**
     * Set an expansion field.
     *
     * @param string $name The field name.
     * @param mixed $value The value.
     */
    public function __set($name, $value)
    {
        $this->expansions[$name] = $value;
    }


    /**
     * Get an expansion field.
     *
     * @param string $name The field name.
     * @return mixed The value.
     */
    public function __get($name)
    {
        if (array_key_exists($name, $this->expansions)) {
            return $this->expansions[$name];
        }
    }


    /**
     * Merge expansion fields into public fields.
     *
     * @return array The record fields.
     */
    public function toArray()
    {
        return array_merge(parent::toArray(), $this->expansions);
    }


    /**
     * Remove `id` and `parent_id` fields.
     *
     * @return array The record fields.
     */
    public function toArrayForExpansion()
    {
        $fields = $this->toArray();
        unset($fields['id'], $fields['parent_id']);
        return $fields;
    }


    /**
     * Update expansions after saving.
     *
     * @param boolean $throwIfInvalid
     */
    public function save($throwIfInvalid = false)
    {

        parent::save($throwIfInvalid);

        // Gather expansion tables.
        $tables = $this->getTable()->getExpansionTables();
        if (!$tables) return;

        // Create or update expansions.
        foreach ($tables as $table) {
            $row = $table->getOrCreate($this);
            $row->setArray($this->toArrayForExpansion());
            $row->save();
        }

    }


    /**
     * Delete all expansions before when the row is deleted.
     */
    public function delete()
    {

        // Delete child rows in all expansion tables.
        foreach ($this->getTable()->getExpansionTables() as $table) {
            $table->deleteByParent($this);
        }

        parent::delete();

    }


    /**
     * Alias unmodified save (used for testing).
     */
    public function __save()
    {
        parent::save();
    }


}
