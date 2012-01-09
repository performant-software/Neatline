<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Record class for exhibits.
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

class NeatlineExhibit extends Omeka_record
{

    /**
     * Record attributes.
     */


    public $added;
    public $name;

    // Foreign keys.
    public $map_id;
    public $image_id;

    // Layout parameters.
    public $top_element;
    public $items_h_pos;
    public $items_v_pos;
    public $items_height;

    // Viewport presence.
    public $is_map;
    public $is_timeline;
    public $is_items;

    // Map position defaults.
    public $default_map_bounds;
    public $default_map_zoom;

    // Default timeline focus.
    public $default_focus_date;

    // Default styles.
    public $default_vector_color;
    public $default_vector_opacity;
    public $default_stroke_color;
    public $default_stroke_opacity;
    public $default_stroke_width;
    public $default_point_radius;

    /**
     * Valid style attribute names.
     */
    private static $styles = array(
        'default_vector_color',
        'default_vector_opacity',
        'default_stroke_color',
        'default_stroke_opacity',
        'default_stroke_width',
        'default_point_radius'
    );


    /**
     * Validate the add Neatline form.
     *
     * @param string $title The title.
     *
     * @return array $errors A list of errors to display.
     */
    public function validateForm($title, $map, $image)
    {

        $errors = array();

        // No title.
        if ($title == '') {
            $errors['title'] = 'Enter a title.';
        }

        // Map and image.
        if (is_numeric($map) && is_numeric($image)) {
            $errors['map'] = 'Choose a map or an image, not both.';
        }

        return $errors;

    }

    /**
     * Save the add Neatline form.
     *
     * @param string $title The title.
     * @param varchar $map The map id.
     * @param varchar $image The image id.
     *
     * @return boolean True if save is successful.
     */
    public function saveForm($title, $map, $image)
    {

        // Set default values.
        $this->name =                   $title;
        $this->top_element =            'map';
        $this->items_h_pos =            'right';
        $this->items_v_pos =            'bottom';
        $this->items_height =           'full';
        $this->is_map =                 1;
        $this->is_timeline =            1;
        $this->is_items =               1;
        $this->map_id =                 null;

        // Check for map.
        if (is_numeric($map)) {
            $this->map_id = $map;
        }

        // Check for image.
        if (is_numeric($image)) {
            $this->image_id = $image;
        }

    }

    /**
     * Fetch the parent map.
     *
     * @return Omeka_record The map.
     */
    public function getMap()
    {

        if (!is_null($this->map_id)) {
            return $this->getTable('NeatlineMapsMap')->find($this->map_id);
        }

        return null;

    }

    /**
     * Fetch the parent image.
     *
     * @return Omeka_record The map.
     */
    public function getImage()
    {

        if (!is_null($this->image_id)) {
            return $this->getTable('NeatlineMapsMap')->find($this->image_id);
        }

        return null;

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
        $this->default_focus_date = $timelineCenter;
        $this->save();

    }

    /**
     * Save viewport arrangement.
     *
     * @param boolean $isMap True if map is present.
     * @param boolean $isTimeline True if timeline is present.
     * @param boolean $isItems True if items is present.
     * @param string $topElement 'map' or 'timeline'.
     * @param string $itemsHorizPos 'left' or 'right'.
     * @param string $itemsVertPos 'top' or 'bottom'.
     * @param string $itemsHeight 'full' or 'partial'.
     *
     * @return Omeka_record The map.
     */
    public function saveViewportArrangement(
        $isMap,
        $isTimeline,
        $isItems,
        $topElement,
        $itemsHorizPos,
        $itemsVertPos,
        $itemsHeight
    )
    {

        // Set values.
        $this->is_map =                 $isMap;
        $this->is_timeline =            $isTimeline;
        $this->is_items =               $isItems;
        $this->top_element =            $topElement;
        $this->items_h_pos =            $itemsHorizPos;
        $this->items_v_pos =            $itemsVertPos;
        $this->items_height =           $itemsHeight;
        $this->save();

    }

    /**
     * Set a style attribute. Only set a value if it is different from
     * the system default. Return true if a row value is set.
     *
     * @param string style The name of the style.
     * @param mixed $value The value to set.
     *
     * @return boolean True if the set succeeds.
     */
    public function setStyle($style, $value)
    {

        // If a non-style property is passed, return false.
        if (!in_array('default_' . $style, self::$styles)) {
            return false;
        }

        // If the value does not match the system default.
        else if ($value != get_option($style)) {
            $this['default_' . $style] = $value;
            return true;
        }

        return false;

    }

    /**
     * Get a style attribute. Look for exhibit-specific default, and
     * fall back on system defaults when local value is unset.
     *
     * @param string style The name of the style.
     *
     * @return mixed The style.
     */
    public function getStyle($style)
    {

        // If there is a row value.
        if (!is_null($this['default_' . $style])) {
            return $this['default_' . $style];
        }

        // Fall back to system default.
        else {
            return get_option($style);
        }

    }

    /**
     * Check whether a given record is active on the map or timeline.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return boolean True if the record is active.
     */
    public function getRecordStatus($item, $spaceOrTime)
    {

        // Get the data record table.
        $_recordsTable = $this->getTable('NeatlineDataRecord');

        // Get the status.
        return $_recordsTable->getRecordStatus($item, $this, $spaceOrTime);

    }

    /**
     * Return the id of the data record for the passed item in the current
     * exhibit. If there is no record, return null.
     *
     * @param Omeka_record $item The item record.
     *
     * @return integer $id The id.
     */
    public function getRecordIdByItem($item)
    {

        // Get the data record table.
        $_recordsTable = $this->getTable('NeatlineDataRecord');

        // Try to get a record.
        $record = $_recordsTable->getRecordByItemAndExhibit($item, $this);

        return ($record) ? $record->id : null;

    }

    /**
     * Return the total number of data records.
     *
     * @return integer $id The record count.
     */
    public function getNumberOfRecords()
    {

        // Get the data record table and query for active records.
        $_recordsTable = $this->getTable('NeatlineDataRecord');
        $records = $_recordsTable->getActiveRecordsByExhibit($this);

        return count($records);

    }

    /**
     * Delete status and element text association records
     * on exhibit delete.
     *
     * @return void.
     */
    public function delete()
    {

        // Get the records table, delete child data.
        $_recordsTable = $this->getTable('NeatlineDataRecord');
        $records = $_recordsTable->findBySql('exhibit_id = ?', array($this->id));
        foreach ($records as $record) { $record->delete(); }

        // Call parent.
        parent::delete();

    }

    /**
     * The exhibit should not save if map_id or image_id are both non-null.
     *
     * @return void.
     */
    public function save()
    {

        if (!(!is_null($this->map_id) && !is_null($this->image_id))) {
            parent::save();
        }

        else {
            return false;
        }

    }

}
