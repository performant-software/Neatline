<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Table class for base layers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineLayerTable extends Omeka_Db_Table
{


    /**
     * Build an associated array of all base layers.
     *
     * @return array An associative array: [record id] => [layer name].
     */
    public function getLayersForSelect()
    {

        $layers = array();

        // Get the records.
        $records = $this->fetchObjects($this->getSelect());

        // Build the array.
        foreach($records as $record) {
            $layers[$record->id] = $record->name;
        };

        return $layers;

    }


    /**
     * Get layer by name.
     *
     * @param string name The name.
     * @return Omeka_Record The layer.
     */
    public function getLayerByName($name)
    {
        return $this->fetchObject(
            $this->getSelect()->where('name = ?', $name)
        );
    }


}
