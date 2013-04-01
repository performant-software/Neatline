<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Row class for stylable record.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_StylableRecord extends Neatline_GenericRecord
{


    private $attribs = array();


    /**
     * Add a key-value pair to `styles`.
     *
     * @param string $name The attribute name.
     * @param mixed $value The value.
     */
    public function __set($name, $value)
    {
        $this->attribs[$name] = $value;
    }


    /**
     * Get style property.
     *
     * @param string $name The attribute name.
     * @return mixed $name The value.
     */
    public function __get($name)
    {
        return $this->attribs[$name];
    }


    /**
     * Merge assigned and public attributes.
     *
     * @return array The record attributes.
     */
    public function toArrayForSave()
    {
        return array_merge(parent::toArrayForSave(), $this->attribs);
    }


    /**
     * Update stylesets after saving.
     *
     * @param boolean $throwIfInvalid
     */
    public function save($throwIfInvalid = true)
    {

        parent::save($throwIfInvalid);

        // Insert/update stylesets.
        foreach ($this->getTable()->getStylesetTables() as $table) {
            $styleset = $table->getOrCreate($this);
            $styleset->setFromArray($this->toArrayForSave());
            $styleset->save();
        }

    }


}
