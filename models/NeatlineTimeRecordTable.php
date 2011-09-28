<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Table class for temporal Neatline data records.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */
?>

<?php

class NeatlineTimeRecordTable extends Omeka_Db_Table
{

    /**
     * Return the data record for a given exhibit and item.
     *
     * @param integer $neatline_id The id of the exhibit.
     * @param integer $item_id The id of the item.
     *
     * @return Omeka_record The data record.
     */
    public function findByElement($neatline_id, $item_id)
    {

        return $this->fetchObject(
            $this->getSelect()->where('neatline_id = '. $neatline_id
                . ' AND item_id = ' . $item_id)
        );

    }

}
