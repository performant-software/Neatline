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

    // Foreign keys.
    public $item_id;
    public $exhibit_id;

    // Text fields.
    public $title;
    public $description;

    // Dates.
    public $start_date;
    public $start_time;
    public $end_date;
    public $end_time;
    public $left_percent;
    public $right_percent;

    // Styles.
    public $vector_color;
    public $vector_opacity;
    public $stroke_color;
    public $stroke_opacity;
    public $stroke_width;
    public $point_radius;

    // Coverage.
    public $geocoverage;
    public $map_bounds;
    public $map_zoom;

    // Statuses and ordering.
    public $space_active;
    public $time_active;
    public $display_order;

    /**
     * Default attributes.
     */
    private static $defaults = array(
        'vector_color' =>       '#724e85',
        'vector_opacity' =>     40,
        'stroke_color' =>       '#ffda82',
        'stroke_opacity' =>     60,
        'stroke_width' =>       1,
        'point_radius' =>       6,
        'left_percent' =>       0,
        'right_percent' =>      100,
        'geocoverage' =>        'POINT()'
    );

    /**
     * Valid style attribute names.
     */
    private static $styles = array(
        'vector_color',
        'vector_opacity',
        'stroke_color',
        'stroke_opacity',
        'stroke_width',
        'point_radius'
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

        $item = null;

        // If record id is defined, get item.
        if (!is_null($this->item_id)) {
           $item = $this->getTable('Item')->find($this->item_id);
        }

        return $item;

    }

    /**
     * Get the parent exhibit record.
     *
     * @return Omeka_record $exhibit The parent exhibit.
     */
    public function getExhibit()
    {

        return $this->getTable('NeatlineExhibit')->find($this->exhibit_id);

    }

    /**
     * Construct a JSON representation of the attributes to be used in the
     * item edit form.
     *
     * @return JSON The data.
     */
    public function buildEditFormJson()
    {

        // Shell out the array.
        $data = array();

        // Set the array values.
        $data['title'] =            $this->getTitle();
        $data['description'] =      $this->getDescription();
        $data['vector_color'] =     $this->getStyle('vector_color');
        $data['vector_opacity'] =   $this->getStyle('vector_opacity');
        $data['stroke_color'] =     $this->getStyle('stroke_color');
        $data['stroke_opacity'] =   $this->getStyle('stroke_opacity');
        $data['stroke_width'] =     $this->getStyle('stroke_width');
        $data['point_radius'] =     $this->getStyle('point_radius');
        $data['start_date'] =       (string) $this->start_date;
        $data['start_time'] =       (string) $this->start_time;
        $data['end_date'] =         (string) $this->end_date;
        $data['end_time'] =         (string) $this->end_time;
        $data['left_percent'] =     $this->getLeftPercent();
        $data['right_percent'] =    $this->getRightPercent();

        // JSON-ify the array.
        return json_encode($data);

    }

    /**
     * Construct a starting attribute set for an Omeka-item-based record.
     *
     * @param Omeka_record $item The item record.
     *
     * @return JSON The data.
     */
    public static function buildEditFormForNewRecordJson($item)
    {

        // Shell out the array.
        $data = array();

        // Set the array values.
        $data['vector_color'] =     self::$defaults['vector_color'];
        $data['vector_opacity'] =   self::$defaults['vector_opacity'];
        $data['stroke_color'] =     self::$defaults['stroke_color'];
        $data['stroke_opacity'] =   self::$defaults['stroke_opacity'];
        $data['stroke_width'] =     self::$defaults['stroke_width'];
        $data['point_radius'] =     self::$defaults['point_radius'];
        $data['left_percent'] =     self::$defaults['left_percent'];
        $data['right_percent'] =    self::$defaults['right_percent'];
        $data['start_date'] =       '';
        $data['start_time'] =       '';
        $data['end_date'] =         '';
        $data['end_time'] =         '';

        // Get DC defaults.
        $data['title'] = neatline_getItemMetadata(
            $item,
            'Dublin Core',
            'Title');

        $data['description'] = neatline_getItemMetadata(
            $item,
            'Dublin Core',
            'Description');

        // JSON-ify the array.
        return json_encode($data);

    }


    /**
     * Setters.
     */


    /**
     * Set the an attribute if the passed value is not null or ''.
     *
     * @param string $attribute The name of the attribute.
     * @param boolean $value The value to set.
     *
     * @return void.
     */
    public function setNotEmpty($attribute, $value)
    {

        if ($value == '') {
            $this[$attribute] = null;
        }

        else {
            $this[$attribute] = $value;
        }

    }

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
     * Set a style attribute. If there is an exhibit default, only set
     * if the passed value is different. If there is no exhibit default,
     * only set if the passed value is different from the system
     * default. If a non-style column name is passed, return false.
     *
     * @param string style The name of the style.
     * @param mixed $value The value to set.
     *
     * @return boolean True if the set succeeds.
     */
    public function setStyle($style, $value)
    {

        // If a non-style property is passed, return false.
        if (!in_array($style, self::$styles)) {
            return false;
        }

        // Get the exhibit.
        $exhibit = $this->getExhibit();

        // If there is an exhibit default.
        if (!is_null($exhibit['default_' . $style])) {
            if ($value != $exhibit['default_' . $style]) {
                $this[$style] = $value;
                return true;
            }
        }

        // If the value does not match the system default.
        else if ($value != self::$defaults[$style]) {
            $this[$style] = $value;
            return true;
        }

        return false;

    }


    /**
     * Getters.
     */


    /**
     * Get a style attribute. In order or priority, return the row
     * value, exhibit default, or system default.
     *
     * @param string style The name of the style.
     *
     * @return mixed The value.
     */
    public function getStyle($style)
    {

        // Get the exhibit.
        $exhibit = $this->getExhibit();

        // If there is a row value.
        if (!is_null($this[$style])) {
            return $this[$style];
        }

        // If there is an exhibit default
        else if (!is_null($exhibit['default_' . $style])) {
            return $exhibit['default_' . $style];
        }

        // Fall back to system default.
        else {
            return self::$defaults[$style];
        }

    }

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

            return neatline_getItemMetadata(
                $this->getItem(),
                'Dublin Core',
                'Title'
            );

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

            return neatline_getItemMetadata(
                $this->getItem(),
                'Dublin Core',
                'Description'
            );

        }

        else {
            return '';
        }

    }

    /**
     * Return left percent.
     *
     * @return integer $percent The percent.
     */
    public function getLeftPercent()
    {

        return !is_null($this->left_percent) ?
            $this->left_percent :
            self::$defaults['left_percent'];

    }

    /**
     * Return right percent.
     *
     * @return integer $percent The percent.
     */
    public function getRightPercent()
    {

        return !is_null($this->right_percent) ?
            $this->right_percent :
            self::$defaults['right_percent'];

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
