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
    protected function _createElementTexts($startDate, $startTime, $endDate, $endTime)
    {

        // Get the Item record type object.
        $recordTypeTable = $this->getTable('RecordType');
        $dateRecordType = $recordTypeTable->findBySql('name = ?', array('Item'), true);

        // Get the date element object.
        $elementTable = $this->getTable('Element');
        $dateElement->findByElementSetNameAndElementName('Dublin Core', 'Date');

        // If start date.
        if ($startDate != '') {

            // Populate.
            $elemenText = new ElementText;
            $elemenText->record_id = $this->item_id;
            $elemenText->record_type_id = $dateRecordType->id;
            $elemenText->element_id = $dateElement->id;
            $elemenText->text = $startDate;
            $elemenText->save();

            // Update self with new id, save.
            $this->start_date_element_text_id = $elemenText->id;
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

    /**
     * Update the child element texts for each of the pieces.
     *
     * @param string $startDate The start date.
     * @param string $startTime The start time.
     * @param string $endDate The end date.
     * @param string $endTime The end time.
     *
     * @return void.
     */
    public function updateElementTexts($startDate, $startTime, $endDate, $endTime)
    {

        // Get the element text table.
        $elementTextTable = $this->getTable('ElementText');

        // Get the Item record type object.
        $recordTypeTable = $this->getTable('RecordType');
        $dateRecordType = $recordTypeTable->findBySql('name = ?', array('Item'));

        // Get the date element object.
        $elementTable = $this->getTable('Element');
        $dateElement->findByElementSetNameAndElementName('Dublin Core', 'Date');

        // ** Start date. **

        // If a start date record already exists.
        if ($this->start_date_element_text_id != null) {

            // Get the element text.
            $text = $elementTextTable->find($this->start_date_element_text_id);

            // If the new element text is not blank.
            if ($startDate != '') {
                $text->text = $startDate;
                $text->save();
            }

            // If the new text is blank, delete the text record.
            else {
                $text->delete();
                $this->start_date_element_text_id = null;
            }

        }

        // If there is no existing start date record.
        else {

            // If the new element text is not blank, create a text.
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

        }

        // ** Start time. **

        // If a start time record already exists.
        if ($this->start_time_element_text_id != null) {

            // Get the element text.
            $text = $elementTextTable->find($this->start_time_element_text_id);

            // If the new element text is not blank.
            if ($startTime != '') {
                $text->text = $startTime;
                $text->save();
            }

            // If the new text is blank, delete the text record.
            else {
                $text->delete();
                $this->start_time_element_text_id = null;
            }

        }

        // If there is no existing start time record.
        else {

            // If the new element text is not blank, create a text.
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

        }

        // ** End date. **

        // If a end date record already exists.
        if ($this->end_date_element_text_id != null) {

            // Get the element text.
            $text = $elementTextTable->find($this->end_date_element_text_id);

            // If the new element text is not blank.
            if ($endDate != '') {
                $text->text = $endDate;
                $text->save();
            }

            // If the new text is blank, delete the text record.
            else {
                $text->delete();
                $this->end_date_element_text_id = null;
            }

        }

        // If there is no existing end date record.
        else {

            // If the new element text is not blank, create a text.
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

        }

        // ** End time. **

        // If a end time record already exists.
        if ($this->end_time_element_text_id != null) {

            // Get the element text.
            $text = $elementTextTable->find($this->$this->end_time_element_text_id);

            // If the new element text is not blank.
            if ($endTime != '') {
                $text->text = $endTime;
                $text->save();
            }

            // If the new text is blank, delete the text record.
            else {
                $text->delete();
                $this->end_time_element_text_id = null;
            }

        }

        // If there is no existing end time record.
        else {

            // If the new element text is not blank, create a text.
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

}
