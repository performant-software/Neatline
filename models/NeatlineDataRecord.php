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
    public $vector_opacity;
    public $stroke_color;
    public $stroke_opacity;
    public $stroke_width;
    public $point_radius;
    public $geocoverage;
    public $left_percent;
    public $right_percent;
    public $space_active;
    public $time_active;
    public $display_order;
    public $map_bounds;
    public $map_zoom;

    /**
     * Default attributes.
     */
    private static $defaults = array(
        'vector_color' => '#724e85',
        'vector_opacity' => 40,
        'stroke_color' => '#ffda82',
        'stroke_opacity' => 60,
        'stroke_width' => 1,
        'point_radius' => 6,
        'geocoverage' => 'POINT()'
    );


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

        // If defined, set the item key.
        if (!is_null($item)) {
            $this->item_id = $item->id;
        }

        // If defined, set the item key.
        if (!is_null($neatline)) {
            $this->exhibit_id = $neatline->id;
        }

        // Set defaults.
        $this->left_percent = 0;
        $this->right_percent = 100;
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
     * Construct a JSON representation of the attributes to be used in the
     * item edit form.
     *
     * @return JSON The data.
     */
    public function buildEditFormJson()
    {

        // Shell out the object literal structure.
        $data = array(
            'title' => '',
            'description' => '',
            'start_date' => '',
            'start_time' => '',
            'end_date' => '',
            'end_time' => '',
            'left_percent' => 0,
            'right_percent' => 100,
            'vector_color' => '#724e85'
        );

        // Set the array values.
        $data['title'] =            $this->getTitle();
        $data['description'] =      $this->getDescription();
        $data['vector_color'] =     $this->getVectorColor();
        $data['start_date'] =       (string) $this->start_date;
        $data['start_time'] =       (string) $this->start_time;
        $data['end_date'] =         (string) $this->end_date;
        $data['end_time'] =         (string) $this->end_time;
        $data['left_percent'] =     $this->left_percent;
        $data['right_percent'] =    $this->right_percent;

        // JSON-ify the array.
        return json_encode($data);

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
     * Set the left_percent or right_percent attributes. Only accept integers
     * between 0 and 100, and require that the right value always be greater
     * than or equal to the left.
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

        $this->left_percent = $left;
        $this->right_percent = $right;

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

        if (!is_null($this->title)) {
            return $this->title;
        }

        else if (!is_null($this->item_id)) {
            return neatline_getItemMetadata($this->getItem(), 'Dublin Core', 'Title');
        }

        else {
            return '';
        }

    }

    /**
     * Return description.
     *
     * @return string $description The description.
     */
    public function getDescription()
    {

        if (!is_null($this->description)) {
            return $this->description;
        }

        else if (!is_null($this->item_id)) {
            return neatline_getItemMetadata($this->getItem(), 'Dublin Core', 'Description');
        }

        else {
            return '';
        }

    }

    /**
     * Return vector color.
     *
     * @return string $color The color.
     */
    public function getVectorColor()
    {

        return !is_null($this->vector_color) ?
            $this->vector_color :
            self::$defaults['vector_color'];

    }

    /**
     * Return vector opacity.
     *
     * @return integer $opacity The opacity.
     */
    public function getVectorOpacity()
    {

        return !is_null($this->vector_opacity) ?
            $this->vector_opacity :
            self::$defaults['vector_opacity'];

    }

    /**
     * Return stroke color.
     *
     * @return string $color The color.
     */
    public function getStrokeColor()
    {

        return !is_null($this->stroke_color) ?
            $this->stroke_color :
            self::$defaults['stroke_color'];

    }

    /**
     * Return stroke opacity.
     *
     * @return integer $opacity The opacity.
     */
    public function getStrokeOpacity()
    {

        return !is_null($this->stroke_opacity) ?
            $this->stroke_opacity :
            self::$defaults['stroke_opacity'];

    }

    /**
     * Return stroke width.
     *
     * @return integer $width The width.
     */
    public function getStrokeWidth()
    {

        return !is_null($this->stroke_width) ?
            $this->stroke_width :
            self::$defaults['stroke_width'];

    }

    /**
     * Return point radius.
     *
     * @return integer $radius The radius.
     */
    public function getPointRadius()
    {

        return !is_null($this->point_radius) ?
            $this->point_radius :
            self::$defaults['point_radius'];

    }

    /**
     * Return coverage.
     *
     * @return string The coverage data.
     */
    public function getGeocoverage()
    {

        return (!is_null($this->geocoverage) && $this->geocoverage != '') ?
            $this->geocoverage :
            self::$defaults['geocoverage'];

    }

}
