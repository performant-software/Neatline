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
    public $default_map_bounds;
    public $default_map_zoom;
    public $default_timeline_focus_date;

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

        // Check for map and timeline.
        if (is_numeric($_post['map'])) {
            $this->map_id = $_post['map'];
            $this->is_map = 1;
        } else {
            $this->map_id = null;
            $this->is_map = 0;
        }

        if (is_numeric($_post['timeline'])) {
            $this->timeline_id = $_post['timeline'];
            $this->is_timeline = 1;
        } else {
            $this->timeline_id = null;
            $this->is_timeline = 0;
        }

        // By default, activate undated items.
        $this->is_undated_items = 1;

        // Set defaults layout parameters.
        $this->top_element = 'map';
        $this->undated_items_position = 'left';
        $this->undated_items_height = 'partial';

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
     * @param string $vectorColor The hex value for the feature vectors.
     * @param string $leftPercentage The left side ambiguity parameter.
     * @param string $rightPercentage The right side ambiguity parameter.
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
        $vectorColor,
        $leftPercentage,
        $rightPercentage,
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

        $identifierElement = $elementTable
            ->findByElementSetNameAndElementName('Dublin Core', 'Identifier');

        // Try to find existing data records given the item and
        // element object.
        $titleRecord = $dataTable
            ->findByElement($this->id, $item->id, $titleElement->id);

        $descriptionRecord = $dataTable
            ->findByElement($this->id, $item->id, $descriptionElement->id);

        $colorRecord = $dataTable
            ->findByElement($this->id, $item->id, $identifierElement->id);

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

            // Create the new record.
            $record = new NeatlineRecord();
            $record->neatline_id = $this->id;
            $record->item_id = $item->id;
            $record->element_id = $titleElement->id;

            // Create the new text.
            $elementText = $record->createElementText($title, 'Title');

            // If a text with the supplied data does not already exist.
            if ($elementText != null) {
                $record->element_text_id = $elementText->id;
                $record->save();
            }

        }


        // ** Description **

        // If a description record already exists, update it.
        if ($descriptionRecord != null) {

            // Update the text.
            $descriptionRecord->updateElementText($description);

        }

        // Otherwise, create one.
        else if ($description != '') {

            // Create the new record.
            $record = new NeatlineRecord();
            $record->neatline_id = $this->id;
            $record->item_id = $item->id;
            $record->element_id = $descriptionElement->id;

            // Create the new text.
            $elementText = $record->createElementText($description, 'Description');

            // If a text with the supplied data does not already exist.
            if ($elementText != null) {
                $record->element_text_id = $elementText->id;
                $record->save();
            }

        }


        // ** Color **

        // If a color record already exists, update it.
        if ($colorRecord != null) {

            // Update the text.
            $colorRecord->updateElementText($vectorColor);

        }

        // Otherwise, create one.
        else if ($vectorColor != '') {

            // Create the new record.
            $record = new NeatlineRecord();
            $record->neatline_id = $this->id;
            $record->item_id = $item->id;
            $record->element_id = $identifierElement->id;

            // Create the new text.
            $elementText = $record->createElementText($vectorColor, 'Identifier');

            // If a text with the supplied data does not already exist.
            if ($elementText != null) {
                $record->element_text_id = $elementText->id;
                $record->save();
            }

        }


        // ** Date **

        // If a date record already exists, update it.
        if ($dateRecord != null) {

            // Update the texts.
            $dateRecord->updateElementTexts(
                $startDate,
                $startTime,
                $endDate,
                $endTime,
                $leftPercentage,
                $rightPercentage
            );

            // Update the percentages.
            $dateRecord->left_ambiguity_percentage = $leftPercentage;
            $dateRecord->right_ambiguity_percentage = $rightPercentage;
            $dateRecord->save();

        }

        // Otherwise, create one.
        else {

            // Create the new record.
            $record = new NeatlineTimeRecord();
            $record->neatline_id = $this->id;
            $record->item_id = $item->id;
            $record->left_ambiguity_percentage = $leftPercentage;
            $record->right_ambiguity_percentage = $rightPercentage;

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
        else if ($geoCoverage != 'null') {

            echo 'test';
            echo $geoCoverage;

            // Creat the new record.
            $record = new NeatlineRecord();
            $record->neatline_id = $this->id;
            $record->item_id = $item->id;
            $record->element_id = $coverageElement->id;

            // Create the new text.
            $elementText = $record->createElementText($geoCoverage, 'Coverage');

            // If a text with the supplied data does not already exist.
            if ($elementText != null) {
                $record->element_text_id = $elementText->id;
                $record->save();
            }

        }

    }

    /**
     * Get the value of a non-temporal Neatline data store.
     *
     * @param Omeka_record $item The item.
     * @param string $field The name of the DC field.
     *
     * @return Omeka_record The text.
     */
    public function getTextByItemAndField($item, $field)
    {

        $text = '';

        // Get the tables.
        $dataTable = $this->getTable('NeatlineRecord');
        $elementTable = $this->getTable('Element');
        $elementTextTable = $this->getTable('ElementText');
        $recordTypeTable = $this->getTable('RecordType');

        // Fetch the element record for the field.
        $element = $elementTable
            ->findByElementSetNameAndElementName('Dublin Core', $field);

        // Get the record type for Item.
        $itemTypeId = $recordTypeTable->findIdFromName('Item');

        // Attempt to find an existing Neatline record.
        $record = $dataTable
            ->findByElement($this->id, $item->id, $element->id);

        // If a record exists, return it.
        if ($record != null) {

            // Update the text.
            $text = $record->getElementText()->text;

        }

        // Otherwise, look for an existing field to use.
        else {

            // Because item() is broken, this has to be done manually.
            $existingTexts = $elementTextTable->fetchObjects(
                $elementTextTable->getSelect()
                    ->where('record_id = ' . $item->id
                        . ' AND record_type_id = ' . $itemTypeId
                        . ' AND element_id = ' . $element->id)
            );

            if ($existingTexts != null) {
                $text = $existingTexts[0]->text;
            }

        }

        return $text;

    }

    /**
     * Get the value of a temporal Neatline data store.
     *
     * @param Omeka_record $item The item.
     * @param string $piece The piece to get - can be 'start_date',
     * 'start_time', 'end_date', or 'end_time'.
     *
     * @return Omeka_record The text.
     */
    public function getTimeTextByItemAndField($item, $piece)
    {

        $text = '';

        // Get the tables.
        $dataTable = $this->getTable('NeatlineTimeRecord');
        $elementTable = $this->getTable('Element');

        $record = $dataTable
            ->findByElement($this->id, $item->id);

        // Try to get a value.
        if ($record != null) {

            $elementText = $record->getElementText($piece);

            if ($elementText != null) {
                $text = $elementText->text;
            }

        }

        return $text;

    }

    /**
     * Get the temporal record for an item.
     *
     * @param Omeka_record $item The item.
     *
     * @return Omeka_record The temporal record.
     */
    public function getTimeRecord($item)
    {

        // Try to find the record.
        $dataTable = $this->getTable('NeatlineTimeRecord');
        return $dataTable->findByElement($this->id, $item->id);

    }

    /**
     * Get an ambiguity percentage for the left or right side.
     *
     * @param Omeka_record $item The item.
     * @param string $side 'left' or 'right'.
     *
     * @return Omeka_record The value.
     */
    public function getAmbiguityPercentage($item, $side)
    {

        // Defaults if no settings present.
        $percentage = ($side == 'left') ? 0 : 100;

        // Try to get a record.
        $record = $this->getTimeRecord($item);

        // If there is a record, get the value.
        if ($record != null) {
            $percentage = ($side == 'left') ?
                $record->left_ambiguity_percentage : $record->right_ambiguity_percentage;
        }

        return $percentage;

    }

    /**
     * Construct the events JSON for timeglider.
     *
     * @return JSON string The events JSON.
     */
    public function timelineEventsJson()
    {

        // Table getters.
        $_statusesTable = $this->getTable('NeatlineRecordStatus');
        $_timeRecordsTable = $this->getTable('NeatlineTimeRecord');

        // Shell array for the events data.
        $json = array(
            'dateTimeFormat' => 'Gregorian',
            'events' => array()
        );

        // Hit the record statuses table to get a list of all
        // items that have active time records.
        $activeItems = $_statusesTable->getItemsWithActiveTimeRecords($this->id);

        // Walk the items with active records, fetch the time records,
        // pack them up.
        foreach ($activeItems as $item) {

            // Fetch record.
            $record = $this->getTimeRecord($item);

            // Title and description fields.
            $title = $this->getTextByItemAndField($item, 'Title');
            $description = $this->getTextByItemAndField($item, 'Description');

            // Date/time raw strings.
            $startDate = $this->getTimeTextByItemAndField($item, 'start_date');
            $startTime = $this->getTimeTextByItemAndField($item, 'start_time');
            $endDate = $this->getTimeTextByItemAndField($item, 'end_date');
            $endTime = $this->getTimeTextByItemAndField($item, 'end_time');

            // Pass the pieces through the timestamp algorithm.
            $timestamps = neatline_generateTimegliderTimestamps(
                $startDate,
                $startTime,
                $endDate,
                $endTime
            );

            // Color and ambiguity settings.
            $color = $this->getTextByItemAndField($item, 'Identifier');
            $leftPercentage = $record->left_ambiguity_percentage;
            $rightPercentage = $record->right_ambiguity_percentage;

            $eventArray = array(
                'eventID' => $item->id,
                'title' => $title,
                'description' => $description,
                'color' => $color,
                'left_ambiguity' => $leftPercentage,
                'right_ambiguity' => $rightPercentage
            );

            // If there is a valid start stamp.
            if (!is_null($timestamps[0])) {

                $eventArray['start'] = $timestamps[0];

                // If there is a valid end stamp.
                if (!is_null($timestamps[1])) {
                    $eventArray['end'] = $timestamps[1];
                }

                // Only push if there is at least a start.
                $json['events'][] = $eventArray;

            }


        }

        return json_encode($json);

    }

    /**
     * Build the vector JSON for the map.
     *
     * @return JSON string The events JSON.
     */
    public function openlayersVectorJson()
    {

        // Table getters.
        $_statusesTable = $this->getTable('NeatlineRecordStatus');
        $_recordsTable = $this->getTable('NeatlineRecord');
        $_elementTable = $this->getTable('Element');

        // Get the coverage element.
        $coverageElement = $_elementTable
            ->findByElementSetNameAndElementName('Dublin Core', 'Coverage');

        // Shell array for the vector data.
        $json = array();

        // Hit the record statuses table to get a list of all
        // items that have active space records.
        $activeItems = $_statusesTable->getItemsWithActiveSpaceRecords($this->id);

        // Walk the items with active records, fetch the time records,
        // pack them up.
        foreach ($activeItems as $item) {

            // Try to find a record.
            $record = $_recordsTable->findByElement($this->id, $item->id, $coverageElement->id);

            if (!is_null($record)) {

                // Weird hack to get rid of the opening and closing brackets that OpenLayers
                // tacks onto the geometry descriptions by default. They cause errors when the
                // JavaScript tries to ingest them.
                $text = str_replace(array('[', ']'), '', json_decode($record->getElementText()->text));
                $title = $this->getTextByItemAndField($item, 'Title');
                $color = $this->getTextByItemAndField($item, 'Identifier');

                $json[] = array(
                    'id' => $item->id,
                    'title' => $title,
                    'color' => $color,
                    'wkt' => $text
                );

            }

        }

        return json_encode($json);

    }

    /**
     * Save default viewport positions.
     *
     * @param string $mapExtent The bounding box for the map.
     * @param string $mapZoom The integer zoom value.
     * @param string $timelineCenter The timestamp for the timeline focus.
     *
     * @return Omeka_record The map.
     */
    public function saveViewportPositions($mapExtent, $mapZoom, $timelineCenter)
    {

        // Set values.
        $this->default_map_bounds = $mapExtent;
        $this->default_map_zoom = intval($mapZoom);
        $this->default_timeline_focus_date = $timelineCenter;
        $this->save();

    }

    /**
     * Save viewport arrangement.
     *
     * @param boolean $isMap True if map is present.
     * @param boolean $isTimeline True if timeline is present.
     * @param boolean $isUndatedItems True if undated items is present.
     * @param string $topElement 'map' or 'timeline'.
     * @param string $udiPosition 'left' or 'right'.
     * @param string $udiHeight 'full' or 'partial'.
     *
     * @return Omeka_record The map.
     */
    public function saveViewportArrangement(
        $isMap,
        $isTimeline,
        $isUndatedItems,
        $topElement,
        $udiPosition,
        $udiHeight
    )
    {

        // Set values.
        $this->is_map = $isMap;
        $this->is_timeline = $isTimeline;
        $this->is_undated_items = $isUndatedItems;
        $this->top_element = $topElement;
        $this->undated_items_position = $udiPosition;
        $this->undated_items_height = $udiHeight;
        $this->save();

    }

    /**
     * Delete status and element text association records
     * on exhibit delete.
     *
     * @return JSON string The events JSON.
     */
    public function delete()
    {

        // Table getters.
        $_statusesTable = $this->getTable('NeatlineRecordStatus');
        $_recordsTable = $this->getTable('NeatlineRecord');
        $_timeRecordsTable = $this->getTable('NeatlineTimeRecord');

        // Get records.
        $statusRecords = $_statusesTable->findBySql('neatline_id = ?', array($this->id));
        $records = $_recordsTable->findBySql('neatline_id = ?', array($this->id));
        $timeRecords = $_timeRecordsTable->findBySql('neatline_id = ?', array($this->id));

        // Delete.
        foreach ($statusRecords as $record) { $record->delete(); }
        foreach ($records as $record) { $record->delete(); }
        foreach ($timeRecords as $record) { $record->delete(); }

        // Call parent.
        parent::delete();

    }

}
