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
     * Instantiate and set parameters.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
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
     * @return Omeka_record $this.
     */
    public function __construct(
        $item,
        $neatline,
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

        parent::__construct();

        // Set foreign keys.
        $this->item_id = $item->id;
        $this->exhibit_id = $neatline->id;
        $this->title = $neatline->id;

        // Set data attributes.
        $this->__setNotEmpty('title', $title, '');
        $this->__setNotEmpty('description', $description, '');
        $this->__setNotEmpty('start_date', $startDate, '');
        $this->__setNotEmpty('start_time', $startTime, '');
        $this->__setNotEmpty('end_date', $endDate, '');
        $this->__setNotEmpty('end_time', $endTime, '');
        $this->__setNotEmpty('vector_color', $vectorColor, '');
        $this->__setNotEmpty('left_ambiguity_percentage', $leftPercentage, '');
        $this->__setNotEmpty('right_ambiguity_percentage', $rightPercentage, '');
        $this->__setNotEmpty('geocoverage', $geoCoverage, '');
        $this->__setStatus('space', $spaceStatus);
        $this->__setStatus('time', $timeStatus);

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
    public function saveItemFormData(
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
        $this->__setNotEmpty('title', $title, '');
        $this->__setNotEmpty('description', $description, '');
        $this->__setNotEmpty('start_date', $startDate, '');
        $this->__setNotEmpty('start_time', $startTime, '');
        $this->__setNotEmpty('end_date', $endDate, '');
        $this->__setNotEmpty('end_time', $endTime, '');
        $this->__setNotEmpty('vector_color', $vectorColor, '');
        $this->__setNotEmpty('left_ambiguity_percentage', $leftPercentage, '');
        $this->__setNotEmpty('right_ambiguity_percentage', $rightPercentage, '');
        $this->__setNotEmpty('geocoverage', $geoCoverage, '');
        $this->__setStatus('space', $spaceStatus);
        $this->__setStatus('time', $timeStatus);

    }

    /**
     * Set a property if the passed value is not empty/null/false, as
     * defined by the $emptyValue parameter.
     *
     * @param string $name The name of the parameter to set.
     * @param mixed $value The value to set.
     * @param mixed $value The empty value to protect against.
     *
     * @return boolean $success True if the attribute is set.
     */
    private function __setNotEmpty($name, $value, $emptyValue)
    {

        $success = false;

        if ($value != $emptyValue) {
            $this->$name = $value;
            $success = true;
        }

        return $success;

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
    private function __setStatus($spaceOrTime, $value)
    {

        $success = false;

        switch ($spaceOrTime) {

            case 'space':
                $this->space_active = is_bool($value) ? $value : null;
            break;

            case 'time':
                $this->time_active = is_bool($value) ? $value : null;
            break;

        }

    }

}
