<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Record class for Neatlines.
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

class NeatlineNeatline extends Omeka_record
{

    public $added;
    public $name;
    public $map_id;
    public $timeline_id;
    public $top_element;
    public $undated_items_position;
    public $undated_items_height;
    public $is_map;
    public $is_timeline;
    public $is_undated_items;

    /**
     * Validate the add Neatline form.
     *
     * @param $_post The post data.
     *
     * @return array $errors A list of errors to display.
     */
    public function validateForm($_post)
    {

        $errors = array();

        if ($_post['title'] == '') {
            $errors['title'] = 'Enter a title';
        }

        if ($_post['map'] == 'none' && $_post['timeline'] == 'none') {
            $errors['map'] = 'Select a map or a timeline';
            $errors['timeline'] = 'Select a map or a timeline';
        }

        return $errors;

    }

    /**
     * Save the add Neatline form.
     *
     * @param $_post The post data.
     *
     * @return boolean True if save is successful.
     */
    public function saveForm($_post)
    {

        $this->populateData($_post);

        return $this->save() ? true : false;

    }

    /**
     * Populate parameters.
     *
     * @param $_post The post data.
     *
     * @return void.
     */
    public function populateData($_post)
    {

        $this->added = neatline_getMysqlDatetime();
        $this->name = $_post['title'];

        $this->map_id = $_post['map'];
        $this->timeline_id = $_post['timeline'];

        $this->top_element = $_post['top_element'];
        $this->undated_items_position = $_post['undated_items_position'];
        $this->undated_items_height = $_post['undated_items_height'];

        $this->is_map = ($_post['is_map'] == 'false') ? 0 : 1;
        $this->is_timeline = ($_post['is_timeline'] == 'false') ? 0 : 1;
        $this->is_undated_items = ($_post['is_undated_items'] == 'false') ? 0 : 1;

    }

    /**
     * Fetch the parent map.
     *
     * @return Omeka_record The map.
     */
    public function getMap()
    {

        return $this->getTable('NeatlineMapsMap')->find($this->map_id);

    }

    /**
     * Fetch the parent timeline.
     *
     * @return Omeka_record The map.
     */
    public function getTimeline()
    {

        return $this->getTable('NeatlineTimeTimeline')->find($this->timeline_id);

    }

    /**
     * Commit changes ajaxed back from the editor.
     *
     * @param Omeka_record $item The item.
     * @param string $title The title.
     * @param string $description The description.
     * @param string $startDate The month/day/year of the start.
     * @param string $startTime The time of the start.
     * @param string $endDate The month/day/year of the end.
     * @param string $endTime The time of the end.
     * @param array $geoCoverage The array of geocoverage data from
     * the map annotations.
     *
     * @return boolean True if the save succeeds.
     */
    public function saveData(
        $item,
        $title,
        $description,
        $startDate,
        $startTime,
        $endDate,
        $endTime,
        $geoCoverage
    )
    {

        // Get the tables.
        $dataTable = $this->getTable('NeatlineRecord');
        $timeDataTable = $this->getTable('NeatlineTimeRecord');
        $elementTable = $this->getTable('Element');

        // Get the element record for each of the DC fields
        // that will be used to house the data.
        $titleElement = $elementTable
            ->findByElementSetNameAndElementName('Dublin Core', 'Title');

        $descriptionElement = $elementTable
            ->findByElementSetNameAndElementName('Dublin Core', 'Description');

        $dateElement = $elementTable
            ->findByElementSetNameAndElementName('Dublin Core', 'Date');

        $coverageElement = $elementTable
            ->findByElementSetNameAndElementName('Dublin Core', 'Coverage');

        // Try to find existing data records given the item and
        // element object.
        $titleRecord = $dataTable
            ->findByElement($this->id, $item->id, $titleElement->id);

        $descriptionRecord = $dataTable
            ->findByElement($this->id, $item->id, $descriptionElement->id);

        $geoCoverageRecord = $dataTable
            ->findByElement($this->id, $item->id, $coverageElement->id);

        $dateRecord = $timeDataTable
            ->findByElement($this->id, $item->id);


        // ** Title **

        // If a title record already exists, update it.
        if ($titleRecord != null) {

            // Update the text.
            $titleRecord->updateElementText($title);

        }

        // Otherwise, create one.
        else if ($title != '') {

            // Creat the new record.
            $record = new NeatlineRecord();
            $record->neatline_id = $this->id;
            $record->item_id = $item->id;
            $record->element_id = $titleElement->id;

            // Create the new text.
            $elementText = $record->createElementText($title);
            $record->element_text_id = $elementText->id;
            $record->save();

        }


        // ** Description **

        // If a description record already exists, update it.
        if ($descriptionRecord != null) {

            // Update the text.
            $descriptionRecord->updateElementText($description);

        }

        // Otherwise, create one.
        else if ($description != '') {

            // Creat the new record.
            $record = new NeatlineRecord();
            $record->neatline_id = $this->id;
            $record->item_id = $item->id;
            $record->element_id = $descriptionElement->id;

            // Create the new text.
            $elementText = $record->createElementText($description);
            $record->element_text_id = $elementText->id;
            $record->save();

        }


        // ** Date **

        // If a date record already exists, update it.
        if ($dateRecord != null) {

            // Update the texts.
            $dateRecord->updateElementTexts(
                $startDate,
                $startTime,
                $endDate,
                $endTime
            );

        }

        // Otherwise, create one.
        else {

            // Create the new record.
            $record = new NeatlineTimeRecord();
            $record->neatline_id = $this->id;
            $record->item_id = $item->id;

            // Create the texts.
            $record->createElementTexts(
                $startDate,
                $startTime,
                $endDate,
                $endTime
            );

        }


        // ** Geocoverage **

        // If a coverage record already exists, update it.
        if ($geoCoverageRecord != null) {

            // Update the texts.
            $geoCoverageRecord->updateElementText($geoCoverage);

        }

        // Otherwise, create one.
        else if ($geoCoverage != '') {

            // Creat the new record.
            $record = new NeatlineRecord();
            $record->neatline_id = $this->id;
            $record->item_id = $item->id;
            $record->element_id = $coverageElement->id;

            // Create the new text.
            $elementText = $record->createElementText($geoCoverage);
            $record->element_text_id = $elementText->id;
            $record->save();

        }

    }

    /**
     * Get the value of a non-temporal Neatline data store.
     *
     * @param Omeka_record $item The item.
     * @param string $field The name of the DC field.
     *
     * @return Omeka_record The map.
     */
    public function getTextByItemAndField($item, $field)
    {



    }

}
