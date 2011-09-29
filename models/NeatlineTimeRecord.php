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
     * Get the element text record for one of the date pieces.
     *
     * @param string $piece The piece to get - can be 'start_date',
     * 'start_time', 'end_date', or 'end_time'.
     *
     * @return Omeka_record The text.
     */
    public function getElementText($piece)
    {

        $elementTextTable = $this->getTable('ElementText');

        switch ($piece) {

            case 'start_date':

                if ($this->start_date_element_text_id != null) {
                    return $elementTextTable->find($this->start_date_element_text_id);
                }

                else {
                    return null;
                }

            break;

            case 'start_time':

                if ($this->start_time_element_text_id != null) {
                    return $elementTextTable->find($this->start_time_element_text_id);
                }

                else {
                    return null;
                }

            break;

            case 'end_date':

                if ($this->end_date_element_text_id != null) {
                    return $elementTextTable->find($this->end_date_element_text_id);
                }

                else {
                    return null;
                }

            break;

            case 'end_time':

                if ($this->end_time_element_text_id != null) {
                    return $elementTextTable->find($this->end_time_element_text_id);
                }

                else {
                    return null;
                }

            break;

        }

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
    public function createElementTexts($startDate, $startTime, $endDate, $endTime)
    {

        // Get the Item record type object.
        $recordTypeTable = $this->getTable('RecordType');
        $dateRecordTypeId = $recordTypeTable->findIdFromName('Item');

        // Get the date element object.
        $elementTable = $this->getTable('Element');
        $dateElement = $elementTable->findByElementSetNameAndElementName('Dublin Core', 'Date');

        // If start date.
        if ($startDate != '') {

            // Populate.
            $text = new ElementText;
            $text->record_id = $this->item_id;
            $text->record_type_id = $dateRecordTypeId;
            $text->element_id = $dateElement->id;
            $text->text = $startDate;
            $text->save();

            // Update self with new id, save.
            $this->start_date_element_text_id = $text->id;

        }

        // If start time.
        if ($startTime != '') {

            // Populate.
            $text = new ElementText;
            $text->record_id = $this->item_id;
            $text->record_type_id = $dateRecordTypeId;
            $text->element_id = $dateElement->id;
            $text->text = $startTime;
            $text->save();

            // Update self with new id, save.
            $this->start_time_element_text_id = $text->id;

        }

        // If end date.
        if ($endDate != '') {

            // Populate.
            $text = new ElementText;
            $text->record_id = $this->item_id;
            $text->record_type_id = $dateRecordTypeId;
            $text->element_id = $dateElement->id;
            $text->text = $endDate;
            $text->save();

            // Update self with new id, save.
            $this->end_date_element_text_id = $text->id;

        }

        // If end time.
        if ($endTime != '') {

            // Populate.
            $text = new ElementText;
            $text->record_id = $this->item_id;
            $text->record_type_id = $dateRecordTypeId;
            $text->element_id = $dateElement->id;
            $text->text = $endTime;
            $text->save();

            // Update self with new id, save.
            $this->end_time_element_text_id = $text->id;

        }

        // Only save if at least one of the pieces has data.
        if ($this->start_date_element_text_id != null
            || $this->start_time_element_text_id != null
            || $this->end_date_element_text_id != null
            || $this->end_time_element_text_id != null
        ) {

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
        $dateRecordTypeId = $recordTypeTable->findIdFromName('Item');

        // Get the date element object.
        $elementTable = $this->getTable('Element');
        $dateElement = $elementTable->findByElementSetNameAndElementName('Dublin Core', 'Date');

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
                $this->save();
            }

        }

        // If there is no existing start date record.
        else {

            // If the new element text is not blank, create a text.
            if ($startDate != '') {

                // Populate.
                $text = new ElementText;
                $text->record_id = $this->item_id;
                $text->record_type_id = $dateRecordTypeId;
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
                $this->save();
            }

        }

        // If there is no existing start time record.
        else {

            // If the new element text is not blank, create a text.
            if ($startTime != '') {

                // Populate.
                $text = new ElementText;
                $text->record_id = $this->item_id;
                $text->record_type_id = $dateRecordTypeId;
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
                $this->save();
            }

        }

        // If there is no existing end date record.
        else {

            // If the new element text is not blank, create a text.
            if ($endDate != '') {

                // Populate.
                $text = new ElementText;
                $text->record_id = $this->item_id;
                $text->record_type_id = $dateRecordTypeId;
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
            $text = $elementTextTable->find($this->end_time_element_text_id);

            // If the new element text is not blank.
            if ($endTime != '') {
                $text->text = $endTime;
                $text->save();
            }

            // If the new text is blank, delete the text record.
            else {
                $text->delete();
                $this->end_time_element_text_id = null;
                $this->save();
            }

        }

        // If there is no existing end time record.
        else {

            // If the new element text is not blank, create a text.
            if ($endTime != '') {

                // Populate.
                $text = new ElementText;
                $text->record_id = $this->item_id;
                $text->record_type_id = $dateRecordTypeId;
                $text->element_id = $dateElement->id;
                $text->text = $endTime;
                $text->save();

                // Update self with new id, save.
                $this->end_time_element_text_id = $text->id;
                $this->save();

            }

        }

        // If all of the pieces are empty, delete the record.
        if ($this->start_date_element_text_id == null
            && $this->start_time_element_text_id == null
            && $this->end_date_element_text_id == null
            && $this->end_time_element_text_id == null
        ) {

            $this->delete();

        }

    }

}
