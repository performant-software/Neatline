<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Row class for Neatline time record.
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

class NeatlineTimeRecord extends Omeka_record
{

    public $neatline_id;
    public $item_id;
    public $start_date_element_text_id;
    public $start_time_element_text_id;
    public $end_date_element_text_id;
    public $end_time_element_text_id;

    /**
     * Extend the constructor so that the class fires off the creator
     * methods automatically on instantiation.
     *
     * @param integer $neatline_id The id of the exhibit.
     * @param integer $item_id The id of the parent item.
     * @param string $startDate The start date.
     * @param string $startTime The start time.
     * @param string $endDate The end date.
     * @param string $endTime The end time.
     *
     * @return void.
     */
    public function __construct(
        $neatline_id,
        $item_id,
        $startDate,
        $startTime,
        $endDate,
        $endTime
    )
    {

        // Call parent.
        parent::__construct();

        // Setters.
        $this->neatline_id = $neatline_id;
        $this->item_id = $item_id;
        $this->save();

        // Create the new element text.
        $this->_createElementTexts($startDate, $startTime, $endDate, $endTime);

    }

    /**
     * Create the child element texts for each of the extant pieces.
     *
     * @param string $startDate The start date.
     * @param string $startTime The start time.
     * @param string $endDate The end date.
     * @param string $endTime The end time.
     *
     * @return void.
     */
    protected function _createElementText($startDate, $startTime, $endDate, $endTime)
    {

        // Get the Item record type object.
        $recordTypeTable = $this->getTable('RecordType');
        $dateRecordType = $recordTypeTable->findBySql('name = ?', array('Item'));

        // Get the date element object.
        $elementTable = $this->getTable('Element');
        $dateElement->findByElementSetNameAndElementName('Dublin Core', 'Date');

        // If start date.
        if ($startDate != '') {

            // Populate.
            $text = new ElementText;
            $text->record_id = $this->item_id;
            $text->record_type_id = $dateRecordType->id;
            $text->element_id = $dateElement->id;
            $text->text = $startDate;
            $text->save();

            // Update self with new id, save.
            $this->start_date_element_text_id = $text->id;
            $this->save();

        }

        // If start time.
        if ($startTime != '') {

            // Populate.
            $text = new ElementText;
            $text->record_id = $this->item_id;
            $text->record_type_id = $dateRecordType->id;
            $text->element_id = $dateElement->id;
            $text->text = $startTime;
            $text->save();

            // Update self with new id, save.
            $this->start_time_element_text_id = $text->id;
            $this->save();

        }

        // If end date.
        if ($endDate != '') {

            // Populate.
            $text = new ElementText;
            $text->record_id = $this->item_id;
            $text->record_type_id = $dateRecordType->id;
            $text->element_id = $dateElement->id;
            $text->text = $endDate;
            $text->save();

            // Update self with new id, save.
            $this->end_date_element_text_id = $text->id;
            $this->save();

        }

        // If end time.
        if ($endTime != '') {

            // Populate.
            $text = new ElementText;
            $text->record_id = $this->item_id;
            $text->record_type_id = $dateRecordType->id;
            $text->element_id = $dateElement->id;
            $text->text = $endTime;
            $text->save();

            // Update self with new id, save.
            $this->end_time_element_text_id = $text->id;
            $this->save();

        }

    }

}
