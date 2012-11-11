<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

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
     * Build an array of base layers of format [id] => [name].
     *
     * @return void.
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
     *
     * @return void.
     */
    public function getLayerByName($name)
    {

        $record = $this->fetchObject(
            $this->getSelect()->where('name = ?', $name)
        );

        return $record ? $record : false;

    }

}
