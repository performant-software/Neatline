<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Row class for Neatline data record.
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

class NeatlineDataRecord extends Omeka_record
{

    // Expose the columns.
    public $item_id;
    public $exhibit_id;
    public $title;
    public $description;
    public $start_date;
    public $start_time;
    public $end_date;
    public $end_time;
    public $vector_color;
    public $geocoverage;
    public $left_ambiguity_percentage;
    public $right_ambiguity_percentage;
    public $space_active;
    public $time_active;
    public $display_order;

    /**
     * Instantiate and foreign keys.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return Omeka_record $this.
     */
    public function __construct($item, $neatline)
    {

        parent::__construct();

        // Set foreign keys.
        $this->item_id = $item->id;
        $this->exhibit_id = $neatline->id;
        $this->title = $neatline->id;

        // Set defaults.
        $this->left_ambiguity_percentage = 0;
        $this->right_ambiguity_percentage = 100;
        $this->space_active = 0;
        $this->time_active = 0;

    }

    /**
     * Update data.
     *
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
     * @return void.
     */
    public function populateRecord(
        $title,
        $description,
        $startDate,
        $startTime,
        $endDate,
        $endTime,
        $vectorColor,
        $leftPercentage,
        $rightPercentage,
        $geoCoverage,
        $spaceStatus,
        $timeStatus
    )
    {

        // Set data attributes.
        $this->title = $title;
        $this->description = $description;
        $this->start_date = $startDate;
        $this->start_time = $startTime;
        $this->end_date = $endDate;
        $this->end_time = $endTime;
        $this->vector_color = $vectorColor;
        $this->left_ambiguity_percentage = $leftPercentage;
        $this->right_ambiguity_percentage = $rightPercentage;
        $this->geocoverage = $geoCoverage;

        // Set status trackers.
        $this->setStatus('space', $spaceStatus);
        $this->setStatus('time', $timeStatus);

    }

    /**
     * Set a property if the passed value is not empty/null/false, as
     * defined by the $emptyValue parameter.
     *
     * @param string $name 'space' or 'time'.
     * @param boolean $value The value to set.
     *
     * @return void.
     */
    public function setStatus($spaceOrTime, $value)
    {

        $success = false;

        // If space.
        if ($spaceOrTime == 'space') {

            // Only change if the input is boolean; otherwise.
            $this->space_active = is_bool($value) ? (int) $value : $this->space_active;

        }

        // If time.
        else {

            // Only change if the input is boolean; otherwise.
            $this->time_active = is_bool($value) ? (int) $value : $this->time_active;

        }

    }

}
