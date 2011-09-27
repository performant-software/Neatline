<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Row class for Neatline record.
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

class NeatlineRecord extends Omeka_record
{

    public $neatline_id;
    public $item_id;
    public $element_id;
    public $element_text_id;

    /**
     * Extend the constructor so that the class fires off the creator
     * methods automatically on instantiation.
     *
     * @param integer $item_id The id of the parent item.
     * @param integer $element_id The id of the element that the new
     * text should be keyed to.
     * @param string $text The data.
     *
     * @return void.
     */
    public function __construct($item_id, $element_id, $text)
    {

        parent::__construct();

        // call creators here.

    }

    /**
     * Fetch the associated element text.
     *
     * @return Omeka_record The text.
     */
    public function getElementText()
    {

        $elementTextTable = $this->getTable('ElementText');
        return $elementTextTable->find($this->element_text_id);

    }

}
