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

    /**
     * Record attributes.
     */
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
    public $map_bounds;
    public $map_zoom;


    /**
     * Instantiate and foreign keys.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return Omeka_record $this.
     */
    public function __construct($item = null, $neatline = null)
    {

        parent::__construct();

        // If defined, set the foreign keys.
        if (!is_null($item) && !is_null($neatline)) {

            // Set foreign keys.
            $this->item_id = $item->id;
            $this->exhibit_id = $neatline->id;

        }

        // Set defaults.
        $this->left_ambiguity_percentage = 0;
        $this->right_ambiguity_percentage = 100;
        $this->space_active = 0;
        $this->time_active = 0;

    }

    /**
     * Get the parent item record.
     *
     * @return Omeka_record $item The parent item.
     */
    public function getItem()
    {

        return $this->getTable('Item')->find($this->item_id);

    }


    /**
     * Setters.
     */


    /**
     * Set the space_active or time_active attributes. Reject non-
     * boolean parameters.
     *
     * @param string $name 'space' or 'time'.
     * @param boolean $value The value to set.
     *
     * @return boolean True if the set succeeds.
     */
    public function setStatus($spaceOrTime, $value)
    {

        if (!is_bool($value)) {
            return false;
        }

        // Cast the boolean to int.
        $intValue = (int) $value;

        // If space.
        if ($spaceOrTime == 'space') {
            $this->space_active = $intValue;
        }

        // If time.
        else {
            $this->time_active = $intValue;
        }

        return true;

    }

    /**
     * Set the left_ambiguity_percentage or right_ambiguity_percentage
     * attributes. Only accept integers between 0 and 100, and require that
     * the right value always be greater than or equal to the left.
     *
     * @param integer $left The left-hand value.
     * @param integer $right The right-hand value.
     *
     * @return boolean True if the set succeeds.
     */
    public function setPercentages($left, $right)
    {

        if (!is_int($left) ||
            !is_int($right) ||
            !(0 <= $left && $left <= $right && $right <= 100)) {
            return false;
        }

        $this->left_ambiguity_percentage = $left;
        $this->right_ambiguity_percentage = $right;

        return true;

    }


    /**
     * Getters.
     */


    /**
     * Return title.
     *
     * @return string $title The title.
     */
    public function getTitle()
    {

        return !is_null($this->title) ?
            $this->title :
            neatline_getItemMetadata($this->getItem(), 'Dublin Core', 'Title');

    }

    /**
     * Return description.
     *
     * @return string $description The description.
     */
    public function getDescription()
    {

        return !is_null($this->description) ?
            $this->description :
            neatline_getItemMetadata($this->getItem(), 'Dublin Core', 'Description');

    }

    /**
     * Return vector color.
     *
     * @return string $color The color.
     */
    public function getColor()
    {

        return !is_null($this->vector_color) ?
            $this->vector_color :
            '#724e85';

    }

    /**
     * Return coverage.
     *
     * @return string $color The color.
     */
    public function getGeocoverage()
    {

        return ($this->geocoverage != '') ?
            $this->geocoverage :
            null;

    }

}
